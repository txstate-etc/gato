function initTableData(def, node, el){
    //create the textarea where the user will paste their excel or word data
    var html = "";
    html += '<textarea id="pastedData" rows="12" cols="60"></textarea>';
    html += '<div id="ie-clipboard-contenteditable" class="hidden" contenteditable="true"></div>';
    $(el).append(html);

    var textArea = document.getElementById("pastedData");

    //get the current value of tableData and put it in the textarea
    var currentValue = $('input[type=hidden].tableData').val();
    $('#pastedData').val(currentValue);

    //when the value of the textarea changes, change the value in the hidden field
    $('#pastedData').on("change", function(){
        $('input[type=hidden].tableData').val($('#pastedData').val()).change();
    });

    //intercept the onPaste event for the textarea IF the browser is not IE or Edge
    //supported browsers have event.clipboardData
    textArea.onpaste = function(event) {
        if(event.clipboardData && event.clipboardData.getData){
            event.preventDefault();
            var tableText = "";
            var tableDataField = $('input[type=hidden].tableData');
            //get the html, not plain text
            var pastedHTML= event.clipboardData.getData('text/html');

            //look for a table tag in the pasted HTML
            var tableElement = $('<div/>').html(pastedHTML).find('table');

            if(tableElement.length > 0){
                tableElement.find('tr').each(function(){
                    $(this).children('td, th').each(function(){
                        //remove the spans that contain excel/word formatting
                        if($(this).find('span').length > 0){
                            $('span',this).contents().unwrap();
                        }
                        if($(this).find('p').length > 0){
                            //Word throws in some <o:p></o:p> tags that we don't need
                            $('p',this).contents().remove('o\\:p');
                            $('p',this).contents().unwrap();
                        }
                        var data = $(this).html();
                        tableText += data.replace(/[\t\n]+/g,' ').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/(&amp;|&)*nbsp;/gi, ' ');
                        //add a tab, unless it is the last column in the row
                        if(!($(this).is(':last-child'))){
                            tableText += "\t";
                        }
                        if ($(this).attr('colspan') > 1) tableText += "\t".repeat($(this).attr('colspan')-1);
                    });
                    //add a newline after each row (except the last one)
                    if(!($(this).is(':last-child'))){
                        tableText += "\n";
                    }
                });
                $('#pastedData').val(tableText).change();
            }
            else{
                //no table element found.  use the plain text
                $('#pastedData').val(event.clipboardData.getData('text/plain')).change();
            }
        }

    }

}
