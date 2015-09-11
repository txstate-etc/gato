package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import java.util.Vector;
import org.apache.xmlrpc.XmlRpcClientLite;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

public class DepartmentDirectoryModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {


    public DepartmentDirectoryModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
        super(content, definition, parent);
    }

    //Retrieve Faculty and/or Staff for a particular
    //department.  Used in the department directory component.
    public Vector getPeople(String department){

        Vector result = new Vector();
        String method = "getResults";
        Vector params = new Vector();
        String searchTerm = "department=\"" + department + "\"";
        params.addElement(searchTerm);

        try{
            XmlRpcClientLite client =
                new XmlRpcClientLite("http://apps.its.txstate.edu/people/RPC.mpl");
            result = (Vector)client.execute( method, params );
        }
        catch(Exception e){
            e.printStackTrace();
        }

        return result;
    }

}