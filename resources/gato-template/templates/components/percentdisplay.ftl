[#assign progress_radius="42"/]
[#assign center_x="50"/]
[#assign center_y="50"/]

<div class="circle-progress ${content.mobile_layout}">
    <div class="svg-container" data-percent="${content.percent_complete!0}" data-radius="${progress_radius}" data-centerx="${center_x}" data-centery="${center_y}">
        <svg version="1.1" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" class="svg-content">
            <circle cx="${center_x}" cy="${center_y}" r="${progress_radius}" stroke="#90867c" stroke-width="6" fill="transparent" class="outer-circle"/>
            <circle cx="${center_x}" cy="${center_y}" r="30" stroke="#b4282e" stroke-width="3" fill="transparent" class="inner-circle"/>
            <path d="M${center_x?number - progress_radius?number} ${center_y}
                     A ${progress_radius} ${progress_radius} 0 0 0 ${center_x?number - progress_radius?number} ${center_y}" stroke="#1e355e" stroke-width="12"  fill="transparent"/>
        </svg>
        <div class="percent">${content.percent_complete!0}%</div>
    </div><!--
  --><div class="content">
        <h3 class="progress-title">${content.title}</h3>
        <p class="progress-text">${content.text}</p>
    </div>
</div>
