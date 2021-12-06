package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.RepositoryException;

import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AddCurrencyToSitemapsTask extends GatoBaseUpgradeTask  {
  private static final Logger log = LoggerFactory.getLogger(AddCurrencyToSitemapsTask.class);

  public AddCurrencyToSitemapsTask () {
    super("Add currency to generated sitemaps", "Update sitemaps that are missing the currency property to never send reminders");
  }

  protected void doExecute (InstallContext ctx) throws RepositoryException{
    Session s = ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitByTemplate(s,"gato-template-txstate2015:pages/sitemap", n-> {
      if (!n.hasProperty("currency")) {
        n.setProperty("currency", "999999");
      }
    });
    visitByTemplate(s,"gato-template-mobilefirst:pages/sitemap", n-> {
      if (!n.hasProperty("currency")) {
        n.setProperty("currency", "999999");
      }
    });
  }
}
