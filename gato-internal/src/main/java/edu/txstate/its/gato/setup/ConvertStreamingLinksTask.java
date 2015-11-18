package edu.txstate.its.gato.setup;

import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.objectfactory.Components;
import info.magnolia.repository.RepositoryConstants;

import java.io.IOException;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Convert old ITS Streaming media urls to their corresponding Mediaflo url.
 */
public class ConvertStreamingLinksTask extends GatoBaseUpgradeTask {

  private static final Logger log = LoggerFactory.getLogger(Gato5MigrationTask.class);

  protected HashMap<String, String> urlMap = new HashMap<String, String>();

  public ConvertStreamingLinksTask(String name, String description) {
    super(name, description);

    // TODO: Find a place to put this file
    MagnoliaConfigurationProperties mcp = Components.getComponent(MagnoliaConfigurationProperties.class);
    String fileName = mcp.getProperty("gato.streamcsvfile");
    File csvFile = new File(fileName);

    try {
      CSVParser parser = CSVParser.parse(csvFile, StandardCharsets.UTF_8, CSVFormat.DEFAULT.withHeader("oldUrl", "newUrl"));

      for (CSVRecord record : parser) {
        urlMap.put(record.get("oldUrl"), record.get("newUrl"));
      }
    } catch(IOException e) {
      log.warn("Couldn't load csv file with url mapping from " + fileName);
    }
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session hm=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitByTemplate(hm, "gato:components/texasState/texas-streaming", n -> {
      String oldUrl = PropertyUtil.getString(n, "videourl", "");
      if (urlMap.containsKey(oldUrl)) {
        n.getProperty("videourl").setValue(urlMap.get(oldUrl));
      }
    });
  }
}
