package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.Property;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/*
 * The submit button on forms will now be configured in the form properties dialog.  It used to be 
 * its own component.  This upgrade task moves the submit button text property out of the component
 * and in to the form properties node.
 */
public class MoveButtonTextToFormPropertiesTask extends GatoBaseUpgradeTask{
    private static final Logger log = LoggerFactory.getLogger(MoveButtonTextToFormPropertiesTask.class);

    public MoveButtonTextToFormPropertiesTask() {
        //GatoBaseUpgradeTask needs a name and a description
        super("MoveButtonTextToFormPropertiesTask", "Move mail template submit button text from component to form properties");
    }

    @Override
    protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
        log.info("Running MoveButtonTextToFormPropertiesTask");
        Session websiteSession = installContext.getJCRSession(RepositoryConstants.WEBSITE);

        visitPages(websiteSession, new NodeVisitor() {
            public void visit(Node n) throws RepositoryException {
                Node formPropertiesNode, mailNode;
                String buttonText;
                String templateId = NodeTypes.Renderable.getTemplate(n);

                //if the page template is any of the mail templates
                if (templateId.equals("gato-template-txstate2015:pages/mail-template")
                    || templateId.equals("gato-template-tsus:pages/mail")
                    || templateId.equals("gato-template-2009:pages/mail")
                    || templateId.equals("gato-template-ua:pages/mail")
                    || templateId.equals("gato-template-wittliff:pages/mail")){
                    //if the template has a mail area
                    if (n.hasNode("mail")){
                        mailNode = n.getNode("mail");
                        //loop through components looking for a submit button
                        for (Node comp : NodeUtil.getNodes(n.getNode("mail"), NodeTypes.Component.NAME)) {
                            if(NodeTypes.Renderable.getTemplate(comp).equals("gato-area-mail:components/formsubmit") 
                                && comp.hasProperty("buttonText")){
                                Property p = comp.getProperty("buttonText");
                                buttonText = p.getString();
                                //get the formproperties/formproperties node
                                if(mailNode.hasNode("formproperties/formproperties")){
                                    formPropertiesNode = mailNode.getNode("formproperties/formproperties");
                                }
                                else{
                                    //create it if it doesn't exist
                                    formPropertiesNode = mailNode.addNode("formproperties", NodeTypes.Area.NAME).addNode("formproperties", NodeTypes.Component.NAME);
                                }
                                //add the buttonText property to the formproperties node
                                formPropertiesNode.setProperty("buttonText", buttonText); 
                                //remove the submit component
                                comp.remove();
                            }
                        }
                    }
                }
            }
        });
        websiteSession.save();
    }
}