package edu.txstate.its.gato;

import info.magnolia.templating.functions.TemplatingFunctions;
import org.apache.xmlrpc.XmlRpcClientLite;
import java.util.Vector;
import java.util.ListIterator;
import java.util.Map;
import java.util.HashMap;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DepartmentDirectoryTemplatingFunctions{

    private static final Logger log = LoggerFactory.getLogger(DepartmentDirectoryTemplatingFunctions.class);
    
    public static final String departmentDirectoryFunctionsName = "ddfn";
    private final TemplatingFunctions tf;

    @Inject
      public DepartmentDirectoryTemplatingFunctions(TemplatingFunctions templatingFunctions) {
        tf = templatingFunctions;
      }

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
            log.warn("Failed to retrieve department members.");
        }

        return result;
    }
}