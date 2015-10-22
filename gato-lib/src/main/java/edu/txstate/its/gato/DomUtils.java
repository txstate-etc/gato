package edu.txstate.its.gato;

import org.w3c.dom.*;
import javax.xml.parsers.*;
import org.apache.commons.lang3.StringEscapeUtils;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;
import org.xml.sax.InputSource;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
// import org.ccil.cowan.tagsoup.HTMLSchema;
// import org.ccil.cowan.tagsoup.Parser;
import org.apache.commons.lang3.StringUtils;
import java.io.StringReader;

/**
 * @author sean
 * 
 * Encapsulates some common functionality for dealing with XML parsed into a
 * DOM.
 * 
 */
public class DomUtils {

	static public Document parseXml(String uri) {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
			return builder.parse(uri);

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	static public String getTextValue( Element item, String tagName, boolean escapeHtml ) {
		String textVal = "";
		Element child = DomUtils.getChildNode(item, tagName);
		if (child != null) {
			Node subnode = child.getFirstChild();
			if (subnode != null) {
				textVal = subnode.getNodeValue();
			}
		}

		if ( escapeHtml ) {
    		textVal = StringEscapeUtils.escapeHtml4(textVal);
    		textVal = textVal.replaceAll("\n", "<br/>");
		}
		return textVal;
	}
	
	static public String getTextValue( Element item, String tagName ) {
		return getTextValue( item, tagName, true );
	}

	static public Element getChildNode(Element item, String name) {
		NodeList children = item.getChildNodes();

		for (int i = 0; i < children.getLength(); i++) {
			Node thisItem = (Node) children.item(i);
			if (thisItem != null && thisItem.getNodeName().equals(name)
					&& thisItem.getParentNode() == item) {
				return (Element) thisItem;
			}
		}
		return null;
	}


	/**************************/
	/* HTML Parsing functions */
	/**************************/

	// private static class TitleHandler extends DefaultHandler {

	// 	boolean saveChars = false;
	// 	private StringBuilder mTitle = new StringBuilder();

	// 	public String getTitle() {
	// 		return mTitle.toString();
	// 	}

	// 	@Override
	// 	public void startElement(String uri, String localName, String name, Attributes atts) throws SAXException {
	// 		if (mTitle.length() > 0) return;
	// 		if (localName.matches("h[1-7]|p")) {
	// 			saveChars = true;
	// 		}
	// 	}

	// 	public void endElement(String uri, String localName, String name)
	// 	{
	// 		saveChars = false;
	// 	}

	// 	public void characters(char[] ch, int start, int length) {
	// 		if (saveChars) {
	// 			mTitle.append(ch, start, length);
	// 		}
	// 	}
	// }

	// static public String parseTitleFromHtmlParagraph(String content) {
	// 	TitleHandler handler = new TitleHandler();
	// 	Parser parser = new Parser();
	// 	try {
	// 		parser.setProperty(Parser.schemaProperty, new HTMLSchema());
	// 		parser.setContentHandler(handler);
	// 		parser.parse(new InputSource(new StringReader(content)));
	// 	} catch (Exception e) {
 //      // Should not happen.
	// 	}

	// 	return StringUtils.abbreviate(handler.getTitle(), 100); 
	// }
}
