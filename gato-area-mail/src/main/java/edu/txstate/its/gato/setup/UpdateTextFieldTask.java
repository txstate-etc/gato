package edu.txstate.its.gato.setup;

import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.repository.RepositoryConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Node;
import javax.jcr.Property;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.jcr.util.NodeVisitor;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/*
 * Updating the TextField content type in the mail templates.  
 * 
 * The senderInfo field used to store whether 
 * a field was a normal field, the sender's name, or the sender's email address.  Checkboxes are now used
 * to indicate whether a field is the sender's name or the sender's email address, so they are stored as 
 * booleans.  For example, if a user chooses the 'e-mail' data type in the dropdown, the "This is the sender's
 * e-mail address" checkbox appears.
 * 
 * The lines stored whether a field was a single line input, or a large or small textarea.
 * The options now are single line and multiple lines.
 *
 * There used to be separate options in the dropdown for E-mail and Texas State Email.  Now, there is just an e-mail
 * option.  Once the user selects the e-mail data type, they can indicate whether it is a Texas State email address
 * or other address.
 */
public class UpdateTextFieldTask extends GatoBaseUpgradeTask{
    private static final Logger log = LoggerFactory.getLogger(UpdateTextFieldTask.class);

    public UpdateTextFieldTask() {
        super("UpdateTextFieldTask", "Update TextField content types to match dialog changes");
    }

    @Override
    protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
        log.info("Running UpdateTextFieldTask");
        Session websiteSession = installContext.getJCRSession(RepositoryConstants.WEBSITE);
        visitByTemplate(websiteSession, "gato-area-mail:components/formedit", new NodeVisitor() {
            public void visit(Node n) throws RepositoryException {
                //use boolean properties to indicate whether or not a field is the submitter's name or e-mail address
                if(n.hasProperty("senderInfo")){
                    String senderInfo = PropertyUtil.getString(n, "senderInfo", "");
                    String dataType = PropertyUtil.getString(n, "dataType", null);
                    if(senderInfo.equals("name")){
                        if(dataType == null || dataType.equals("none") || dataType.equals("txemail") || dataType.equals("email")){
                            n.setProperty("isSenderName", true);
                            n.setProperty("dataType", "name");
                        }
                        else{
                            n.setProperty("isSenderName", false);
                        }
                    }
                    else if(senderInfo.equals("email")){
                        if(dataType == null || dataType.equals("none") || dataType.equals("txemail") || dataType.equals("email")){
                            n.setProperty("isSenderEmail", true);
                            if(n.hasProperty("dataType") && n.getProperty("dataType").getString().equals("txemail"))
                                n.setProperty("dataType", "txemail");
                            else
                                n.setProperty("dataType", "email");
                        }
                        else{
                            n.setProperty("isSenderEmail", false);
                        }
                    }
                    n.getProperty("senderInfo").remove();
                }
                //update lines property
                if(n.hasProperty("lines")){
                    Property lines = n.getProperty("lines");
                    if(lines.getString().equals("small") || lines.getString().equals("large")){
                        n.setProperty("lines", "multi");
                    }
                }
                //add emailType field and convert txemail dataType to 
                if(n.hasProperty("dataType")){
                    if(PropertyUtil.getString(n, "dataType").equals("email")){
                        n.setProperty("emailType", "other");
                    }
                    if(PropertyUtil.getString(n, "dataType").equals("txemail")){
                        n.setProperty("emailType", "txstate");
                        n.setProperty("dataType", "email");
                    }
                }
            }
        });
    }
}