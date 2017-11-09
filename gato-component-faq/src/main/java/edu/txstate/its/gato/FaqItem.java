package edu.txstate.its.gato;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.link.LinkUtil;
import info.magnolia.link.LinkException;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;
import info.magnolia.ui.vaadin.integration.jcr.JcrNewNodeAdapter;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringUtils;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

import com.vaadin.data.util.ObjectProperty;

public class FaqItem {
  @Getter public String id;
  @Getter public String nodetype;
  @Getter public String question;
  @Getter public String answer;
  @Getter public String title;
  @Getter public String uuid;
  @Getter public List<FaqItem> children = new ArrayList<FaqItem>();

  public FaqItem(Node node) {
    nodetype = PropertyUtil.getString(node, "nodetype");

    try {
      id = node.getName();
      uuid = node.getIdentifier();
    } catch (RepositoryException e) {
      e.printStackTrace();
    }

    if ("group".equals(nodetype)) {
      title = PropertyUtil.getString(node, "title", "");
      if (StringUtils.isEmpty(title)) { title = "--No Text Entered--"; }

      try {
        for (Node c : NodeUtil.getNodes(node, NodeTypes.Area.NAME)) {
          children.add(new FaqItem(c));
        }
      } catch (RepositoryException e) {
        e.printStackTrace();
      }
    }
    else {
      question = PropertyUtil.getString(node, "question", "");
      answer = PropertyUtil.getString(node, "answer", "");
      if (StringUtils.isEmpty(question)) { question = "--No Text Entered--"; }

      try {
        answer = LinkUtil.convertLinksFromUUIDPattern(answer);
      }
      catch (LinkException e) {
        e.printStackTrace();
      }
    }
  }
}
