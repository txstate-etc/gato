package edu.txstate.its.gato;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import info.magnolia.jcr.util.PropertyUtil;
import org.apache.commons.lang3.StringUtils;



public class TableModel<RD extends ConfiguredTemplateDefinition> extends RenderingModelImpl<ConfiguredTemplateDefinition> {

    public TableModel(Node content, ConfiguredTemplateDefinition definition, RenderingModel<?> parent) throws PathNotFoundException, RepositoryException {
        super(content, definition, parent);
    }

    public String parseTableData(String cssClasses){
        String tableHTML="";
        String tableData = PropertyUtil.getString(content, "tableData", "");
        boolean hasHeader = PropertyUtil.getBoolean(content, "tableHeader", false);

        tableHTML += "<table cellspacing=\"0\" class=\"" + cssClasses + "\">";

        String[] rows = tableData.split("\n");
        int startingRow = 0;

        //build header row
        if(hasHeader && rows.length > 0){
            startingRow = 1; // for body
            tableHTML += "<thead\n>";
            tableHTML += "<tr>\n";
            String[] cols = StringUtils.splitPreserveAllTokens(rows[0], "\t");
            for (int col = 0; col < cols.length; col++) {
                tableHTML += "<th>";
                tableHTML += cols[col];
                tableHTML += "</th>\n";
            }
            tableHTML += "</tr>\n";
            tableHTML +="</thead>\n";
        }
        //table body
        if (rows.length > startingRow) {
            tableHTML += "<tbody>\n";
            for (int row = startingRow; row < rows.length; row++) {
                tableHTML += "<tr";
                tableHTML += " class=\"";
                tableHTML += (row % 2 == 0 ? "even" : "odd");
                tableHTML += "\">\n";
                String[] cols = StringUtils.splitPreserveAllTokens(rows[row], "\t");
                for(int col=0; col < cols.length; col++){
                    tableHTML += "<td>";
                    tableHTML += cols[col];
                    tableHTML += "</td>\n";
                }
                tableHTML += "</tr>\n";
            }
            tableHTML += "</tbody>\n";
        }
        tableHTML += "</table>";
        return tableHTML;
    }
}

