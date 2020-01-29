package edu.txstate.its.gato.apputil;

import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.templates.ConfiguredSiteTemplateAvailability;
import info.magnolia.module.site.templates.TemplateConfig;
import info.magnolia.rendering.template.TemplateAvailability;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Workspace;

import java.util.Collection;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CalicoTemplateAvailability extends ConfiguredSiteTemplateAvailability {
  private static final Logger log = LoggerFactory.getLogger(CalicoTemplateAvailability.class);
  
  @Override
  public boolean isAvailable(Node node, TemplateDefinition templateDefinition) {
    if (node == null || templateDefinition == null) {
      return false;
    }

    // Templates with visible property is set to false are not available
    if (BooleanUtils.isFalse(templateDefinition.getVisible())) {
      return false;
    }
    
   //templates with type=subpage should not be allowed at the root level
    try {
      String type = templateDefinition.getType();
      if (node.getDepth() == 1 && type.equals("subpage")) {
        return false;
      }
    } catch (RepositoryException e) {
      log.error("Can't verify availability of the template", e);
    }

    try {
      final Workspace workspace = node.getSession().getWorkspace();
      if (!RepositoryConstants.WEBSITE.equals(workspace.getName())) {
        return false;
      }
    } catch (RepositoryException e) {
      log.error("Not able to access the Node's session or workspace.", e);
      return false;
    }

    if ((isEnableAll() || getEnableAllWithRenderType().contains(templateDefinition.getRenderType())) && StringUtils.substringAfter(templateDefinition.getId(), ":").startsWith("pages/")) {
      return true;
    }

    if (!getTemplates().containsKey(templateDefinition.getId())) {
      return false;
    }

    // Check configured roles
    final TemplateConfig templateConfig = getTemplates().get(templateDefinition.getId());
    final Collection<String> roles = templateConfig.getRoles();
    if (!roles.isEmpty()) {
      if (!CollectionUtils.containsAny(MgnlContext.getUser().getAllRoles(), roles)) {
        return false;
      }
    }

    return true;
  }
}
