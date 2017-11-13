package edu.txstate.its.gato.setup;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateHeroSliderTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(UpdateHeroSliderTask.class);

  public UpdateHeroSliderTask() {
    super("Update Wittliff Hero Slider", "Remove slider functionality from Wittliff Hero Slider.");
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);

    visitPages(s, n -> {
      if (n.getDepth() == 0) {
        log.warn("processing "+n.getName()+"...");
      }

      if (n.hasNode("hero-slider")) {
        log.warn("updating a hero slider at "+n.getPath());
        Node area = n.getNode("hero-slider");
        boolean justzapit = true;
        if (area.hasNodes()) {
          Node component = area.getNodes().nextNode();
          if (component.hasNode("slides")) {
            Node slides = component.getNode("slides");
            if (slides.hasNodes()) {
              Node slide = slides.getNodes().nextNode();
              s.move(slide.getPath(), area.getPath()+"/imported");
              justzapit = false;
              component.remove();
            }
          }
        }
        if (justzapit) area.remove();
      }
    });
  }
}
