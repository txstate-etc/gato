jQuery(document).ready(function($) {

    window.txstsearch = function () {
        var ts = window.txstsearch;

        ts.html_pagination = function (page, lastpage) {
          if (lastpage == 1) return '';
            var html = '<nav aria-label="Pagination">';
            html += '<ul class="pagination">';
            html += '<li><a href="#" class="pagination-link previous' + (page > 1 ? " enabled" : "") + '" aria-label="Previous Page" data-page="'+Math.max(page-1, 1)+'" aria-disabled="'+(page == 1 ? 'true' : 'false')+'">< Previous</a></li>';
            //first page
            html += '<li><a href="#" class="pagination-link" aria-current="' + (page == 1?"page":"false") + '" aria-label="Page 1" data-page="1">1</a></li>';
            //first ellipsis, if needed
            if(lastpage > 4 && page > 3){
                html += '<li><span class="nonlink">...</span></li>';
            }
            if(lastpage > 2){
                if(lastpage == 3){
                    html += '<li><a href="#" class="pagination-link" aria-current="'+(page == 2?"page":"false")+'" aria-label="Page 2" data-page="2">2</a></li>';
                }
                else{
                    for (var i = Math.min(Math.max(page - 1, 2), lastpage-2); i <= Math.max(Math.min(page + 1, lastpage - 1),3); i++) {
                      html += '<li><a href="#" class="pagination-link" aria-current="'+(i==page?"page":"false")+'" aria-label="Page '+i+'" data-page="'+i+'">'+i+'</a></li>';
                    }
                }
            }
            //second ellipsis, if needed
            if(lastpage > 4 && page < (lastpage - 2)){
                html += '<li><span class="nonlink">...</span></li>';
            }
            //last page
            html += '<li><a href="#" class="pagination-link" aria-current="' + (page == lastpage?"page":"false") + '" aria-label="Page ' + lastpage + '" data-page="' + lastpage + '">' + lastpage + '</li>';
            html += '<li><a href="#" class="pagination-link next' + (page < lastpage ? " enabled" : "") + '" aria-label="Next Page" data-page="'+Math.min(page+1, lastpage)+'" aria-disabled="'+(page == lastpage ? 'true' : 'false')+'">Next ></a></li>';
            html += '</ul>';
            return html;
        };
    };
    txstsearch();
});
