package edu.txstate.its.gato.setup;

import info.magnolia.dam.app.setup.migration.MoveDataWorkspaceToDamMigrationTask;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import com.google.common.collect.Lists;

import javax.jcr.Node;
import javax.jcr.Session;

import info.magnolia.module.delta.TaskExecutionException;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MoveDmsToDamTask extends MoveDataWorkspaceToDamMigrationTask {
  private static final Logger log = LoggerFactory.getLogger(MoveDmsToDamTask.class);

  public MoveDmsToDamTask() {
    super("DAM Migration - DMS", "Move binary files from the DMS tree to the DAM.",
      Arrays.asList("/"), "", "dms");
  }

  @Override
  protected void copyNodesFromDataRepositoryToDam(String dataPath, String targetSubPath) throws TaskExecutionException {
    log.info("copyNodesFromDataRepositoryToDam");
    try {
      Session dam = (Session) grabPrivateVar("damSession");
      Session data = (Session) grabPrivateVar("dataSession");
      for (Node child : NodeUtil.getNodes(data.getRootNode(), NodeTypes.Content.NAME)) {
        String sourcePath = child.getPath();
        String destPath = sourcePath;
        dam.getWorkspace().clone("dms", sourcePath, destPath, true);
        log.info("Following " + "dms" + ":" + sourcePath + " moved to dam:" + destPath);
        dam.save();
      }
    } catch (Exception e) {
      throw new TaskExecutionException("Could not copy nodes from dms to DAM workspace. ", e);
    }
  }

  protected Object grabPrivateVar(String name) throws TaskExecutionException{
    try {
      Class<?> clazz = getClass().getSuperclass();
      Field field = clazz.getDeclaredField(name);
      field.setAccessible(true);
      return field.get(this);
    } catch (Exception e) {
      throw new TaskExecutionException("Reflection failed.");
    }
  }
}
