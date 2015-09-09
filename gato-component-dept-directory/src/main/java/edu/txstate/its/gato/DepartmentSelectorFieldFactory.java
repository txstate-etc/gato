package edu.txstate.its.gato;

import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;
import info.magnolia.ui.form.field.factory.SelectFieldFactory;

import org.apache.xmlrpc.XmlRpcClientLite;
import java.util.Vector;
import java.util.List;
import java.util.ArrayList;
import java.util.ListIterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.data.Item;


public class DepartmentSelectorFieldFactory extends SelectFieldFactory<DepartmentSelectorDefinition> {

    private static final Logger log = LoggerFactory.getLogger(DepartmentSelectorFieldFactory.class);

    //@Inject
    public DepartmentSelectorFieldFactory(DepartmentSelectorDefinition definition, Item relatedFieldItem) {
        super(definition, relatedFieldItem);
    }

    //Get the options (list of departments) for the select field
    @Override
    public List<SelectFieldOptionDefinition> getSelectFieldOptionDefinition() {
        List<SelectFieldOptionDefinition> res = new ArrayList<SelectFieldOptionDefinition>();

        try{
            //use xmlrpc to get list of departments
            XmlRpcClientLite client =
                new XmlRpcClientLite("http://apps.its.txstate.edu/people/RPC.mpl");
                
            String method = "getDepartmentList";
            Vector params = new Vector();
            Vector result = (Vector)client.execute( method, params );
            
            ListIterator i = result.listIterator();
            while (i.hasNext() )
            {
                //make an option for each one
                SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
                String department = (String)i.next();
                //set label and value for each option (same)
                option.setValue(department);
                option.setLabel(department);
                res.add(option);
            }
            return res;
        }
        catch(Exception e){
            log.warn("Malformed URL.  Unable to retrieve department list.");
            return res;
        }
    }


    @Override
    protected Class<?> getDefaultFieldType() {
        return String.class;
    }

}