package edu.txstate.its.gato;

import info.magnolia.resourceloader.ResourceOrigin;
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
	protected final ResourceOrigin origin;

	public GatoSassImporter(ResourceOrigin origin) {
	  this.origin = origin;
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

      String actualurl = "";
      if (this.origin.hasPath(scssurl)) actualurl = scssurl;
      else if (this.origin.hasPath(partialurl)) actualurl = partialurl;
      else if (this.origin.hasPath(resourceurl)) actualurl = resourceurl;
      else if (this.origin.hasPath(cssurl)) actualurl = cssurl;
      Resource resource = this.origin.getByPath(actualurl);
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
