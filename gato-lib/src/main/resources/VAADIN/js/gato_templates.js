// Register a template definition set named "default".
CKEDITOR.addTemplates( 'gato_templates',
{
    // The name of the subfolder that contains the preview images of the templates.
    //imagesPath : '../../images/editor-templates/',
    imagesPath : CKEDITOR.vaadinDirUrl + 'js/richeditorimages/',
 
    // Template definitions.
    templates :
        [
            {
                title: 'Two Small Images, One Large',
                image: '2small-1big.gif',
                description: 'Two small images with a link and short description on the left, and one large image with a link on the right.',
                html:
                    '<table cellspacing="1" cellpadding="1" border="0" align="" summary="">\
    <tbody>\
        <tr>\
            <td width="100%" style="padding-right: 5px">\
                <a href=""><img width="75" height="75" border="1" style="margin: 5px 10px 5px 0px;" align="left" alt="" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" /></a>\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
            <td width="155px" rowspan="2" style="border-left:1px solid rgb(209, 206, 167)">\
                <div align="center">\
                    <a href=""><img width="155" vspace="5" hspace="10" height="155" border="1" alt="" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" /></a>\
                </div>\
                <div align="center"><a href="">Simple Title Link</a></div>\
            </td>\
        </tr>\
        <tr>\
            <td width="100%" style="padding-right: 5px">\
                <a href=""><img width="75" height="75" style="margin: 5px 10px 5px 0px;" border="1" align="left" alt="" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" /></a>\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
        </tr>\
    </tbody>\
</table>'
            },
            {
                title: 'One Small Image (Right) With Text',
                image: '1smallRight.gif',
                description: 'One small image on the left with text.',
                html:
                    '<table width="100%" cellspacing="1" cellpadding="1" border="0" align="" summary="">\
    <tbody>\
        <tr>\
            <td width="100%" valign="top" style="padding-right: 5px;">\
                <a href=""><img width="75" height="75" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" alt="" style="border-width: 1px; float: right; margin: 5px 0px 5px 10px;" /></a>\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
        </tr>\
    </tbody>\
</table>'
            },
            {
                title: 'One Small Image (Left) With Text',
                image: '1smallLeft.gif',
                description: 'One small image on the left with text.',
                html:
                    '<table width="100%" cellspacing="1" cellpadding="1" border="0" align="" summary="">\
    <tbody>\
        <tr>\
            <td width="100%" valign="top" style="padding-right: 5px;">\
                <a href=""><img width="75" height="75" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" alt="" style="border-width: 1px; float: left; margin: 5px 10px 5px 0px;" /></a>\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
        </tr>\
    </tbody>\
</table>'
            },
            {
                title: 'One Large Image (Right) With Text',
                image: '1largeRight-text.gif',
                description: 'One large image on the right with text on the left.',
                html:
                    '<table cellspacing="1" cellpadding="1" border="0" align="" summary="">\
    <tbody>\
        <tr>\
            <td width="100%" valign="top" style="padding-right: 5px;">\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
            <td width="155">\
                <div align="center">\
                    <a href=""><img width="155" height="155" vspace="5" hspace="10" border="1" alt="" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" /></a>\
                </div>\
                <div align="center">\
                    <a href="">Simple Title Link</a>\
                </div>\
            </td>\
        </tr>\
    </tbody>\
</table>'
            },
            {
                title: 'One Large Image (Left) With Text',
                image: '1largeLeft-text.gif',
                description: 'One large image on the left with text on the right.',
                html:
                    '<table cellspacing="1" cellpadding="1" border="0" align="" summary="">\
    <tbody>\
        <tr>\
            <td width="155">\
                <div align="center">\
                    <a href=""><img width="155" height="155" style="margin: 5px 10px 5px 0px;" border="1" alt="" src="http://www.txstate.edu/magnoliaAssets/paragraphs/images/gray-spacer.gif" /></a>\
                </div>\
                <div align="center">\
                    <a href="">Simple Title Link</a>\
                </div>\
            </td>\
            <td width="100%" valign="top" style="padding-right: 5px;">\
                <a href="">Link to Article</a>\
                <div align="justify">A brief description of the text about the article.</div>\
            </td>\
        </tr>\
    </tbody>\
</table>'
            },
        ]
});
