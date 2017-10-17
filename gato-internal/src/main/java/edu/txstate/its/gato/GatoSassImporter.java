package edu.txstate.its.gato;

import info.magnolia.module.resources.ResourceLinker;
import info.magnolia.resourceloader.Resource;

import io.bit3.jsass.importer.Import;
import io.bit3.jsass.importer.Importer;

import java.net.URI;
import java.util.Collection;
import java.util.LinkedList;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoSassImporter implements Importer {
	private static Logger log = LoggerFactory.getLogger(GatoSassImporter.class);
	protected final ResourceLinker ln;

	public GatoSassImporter(ResourceLinker linker) {
	  this.ln = linker;
	}

	@Override
  public Collection<Import> apply(String url, Import previous) {
    LinkedList<Import> ret = new LinkedList<Import>();
    try {
      String fn = FilenameUtils.getName(url);
      String path = FilenameUtils.getPath(url);
      if (StringUtils.isBlank(path))
        path = FilenameUtils.getPath(previous.getAbsoluteUri().toString());
      if (!path.startsWith("/")) path = "/" + path;
      String resourceurl = path+fn;
      String scssurl = path+fn+".scss";
      String partialurl = path+"_"+fn+".scss";
      String cssurl = path+fn+".css";
      Resource resource = ln.getResource(scssurl);
      if (resource == null) resource = ln.getResource(partialurl);
      if (resource == null) resource = ln.getResource(resourceurl);
      if (resource == null) resource = ln.getResource(cssurl);
      Import uriImport = new Import(
        new URI(url),
        new URI(resource.getPath()),
        IOUtils.toString(resource.openReader())
      );
      ret.add(uriImport);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return ret;
  }
}
