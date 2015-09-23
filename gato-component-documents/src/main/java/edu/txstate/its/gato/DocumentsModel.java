package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import info.magnolia.templating.functions.TemplatingFunctions;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.dam.api.Asset;
import info.magnolia.context.MgnlContext;

import info.magnolia.cms.util.QueryUtil;

import java.text.SimpleDateFormat;
import java.util.Vector;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.LoginException;


public class DocumentsModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {

    private final DamTemplatingFunctions damfn;

    public DocumentsModel(Node content, 
                          ConfiguredTemplateDefinition definition, 
                          RenderingModel<?> parent, 
                          DamTemplatingFunctions damTemplatingFunctions) throws PathNotFoundException, RepositoryException, LoginException {
        super(content, definition, parent);
        this.damfn = damTemplatingFunctions;
    }

    /*
    * In the DAM, there is an option to add a title for an asset but it is optional.  If a title has been
    * entered for the asset, use that for the display name.  Otherwise, use the filename minus the extension.
    */
   private String buildDisplayTitle(Asset asset){
        String titleValue = asset.getTitle();
        if(titleValue.length() < 1){
            String name = asset.getFileName();
            return FilenameUtils.removeExtension(name);
        }
        else{
            return titleValue;
        }

   }

   /* Return an appropriate font awesome icon class based on the file extension */
   private String getIconClass(String extension){
        switch(extension){
            case "DOC" :
            case "DOCX" :
                return "fa-file-word-o";
            case "PDF" :
                return "fa-file-pdf-o";
            case "TXT" :
                return "fa-file-text-o";
            case "ZIP" :
                return "fa-file-archive-o";
            case "HTML" : 
                return "fa-file-code-o";
            case "GIF" :
            case "PNG" :
            case "JPG" :
            case "JPEG" :
            case "BMP" :
                return "fa-file-image-o";
            case "PPT" :
                return "fa-file-powerpoint-o";
            case "XLS" :
            case "XLSX" :
                return "fa-file-excel-o";
            case "MP4" :
            case "AVI" :
            case "FLV" :
            case "WMV" :
            case "MOV" :
                return "fa-file-video-o";
            case "MP3" :
                return "fa-file-sound-o";
            default :
                return "fa-file-text-o";
        }
   }

    public List<Document> getFiles(String link, String extension){
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm" );
        List<Document> foundDocuments = new ArrayList<Document>();
        ArrayList expressions = new ArrayList();

        // if a link is defined (folder or document)
        if(StringUtils.isNotEmpty(link)){
            try {
            
                Node linkNode = MgnlContext.getJCRSession("dam").getNode(link);
                Boolean isFolder = linkNode.isNodeType("mgnl:folder");
                if( isFolder ){
                    expressions.add("jcr:path like '" + link + "/%'");
                }
                // a single file
                else if(linkNode.isNodeType("mgnl:asset")){
                        expressions.add("jcr:path like '" + link + "'");
                }
                // search on file type
                if( StringUtils.isNotEmpty(extension) && isFolder ) {
                    String extensionSearchTerm = extension.replaceAll( "\\WOR\\W|\\W+", " OR " );
                    expressions.add( "CONTAINS ( extension, '" + extensionSearchTerm + "')" );
                }

                String where = StringUtils.join(expressions.iterator(), " and ");
                String queryStr= "SELECT * FROM nt:base WHERE " + where;

                NodeIterator nodeIterator = QueryUtil.search("dam",
                                            queryStr,
                                            javax.jcr.query.Query.SQL);
                

                while(nodeIterator.hasNext()){
                    Node node = nodeIterator.nextNode();
        
                    //ignore folders
                    if(node.isNodeType("mgnl:asset")){
                        Asset asset = damfn.getAssetForAbsolutePath("jcr", node.getPath());
                        Document doc = new Document();
                        String path = damfn.getAssetLink(asset.getItemKey().asString());
                        String fileExtension = FilenameUtils.getExtension(asset.getFileName()).toUpperCase();
                        doc.setIconClass(getIconClass(fileExtension));
                        doc.setTitle(buildDisplayTitle(asset));
                        doc.setExtension(fileExtension);
                        doc.setFileSize(FileUtils.byteCountToDisplaySize(asset.getFileSize()));
                        doc.setPath(path);
                        doc.setSubject(asset.getSubject());
                        doc.setDescription(asset.getDescription());
                        foundDocuments.add(doc);
                    }    
                }
               
            } catch (Exception e) {
                Document doc = new Document();
                doc.setIconClass("fa-question");
                doc.setTitle("Error - Document Missing");
                doc.setExtension("N/A");
                doc.setFileSize("0");
                doc.setPath("/iambrokenordeleted");
                doc.setSubject("");
                doc.setDescription("");
                doc.setBrokenLink(true);
                foundDocuments.add(doc);
            }
        }
        return foundDocuments;
    }

}