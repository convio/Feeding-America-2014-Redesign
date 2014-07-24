 <t:if test="length > 0">
  <t:list>
    <t:set id="videoid" value="replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(video_url,'http://',''),'https://',''),'watch',''),'embed',''),'www.',''),'youtube.com',''),'youtu.be',''),'v=',''),'?',''),'&',''),'/','')" />
    <div class="video-container"><iframe src="//www.youtube.com/embed/${videoid}?html5=1&controls=0&autohide=1&showinfo=0&enablejsapi=1" frameborder="0" allowfullscreen="" id="story-${itemID}-video"></iframe></div>
  </t:list>
</t:if>