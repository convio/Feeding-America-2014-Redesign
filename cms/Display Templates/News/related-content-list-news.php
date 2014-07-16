<t:if test="length > 0">
  <div class="sidebar-promo-box promo">
    <div class="sidebar-promo related-content list-items-container">
      <h6>Related Content</h6>
      <div class="list-items">
        <t:list>
        <div class="list-item">
          <t:if test="thumb.length > 0"><t:list id="thumb" maxlength="1"><div class="list-item-thumbnail"><a href="${url}"><img src="http://fa.pub30.convio.net/assets/images/klein.jpg" alt="alttext" border="0" /></a></div></t:list></t:if>
          <div class="list-item-text">
            <div class="list-item-title"><a href="${url}">${title}</a></div>
          </div><!--/.list-item-text-->
          <div class="clearfix"></div>
        </div><!--/.list-item-->
        </t:list>
      </div><!--/.list-items-->
    </div><!--/.sidebar-promo.related-contentlist-items-container-->
  </div><!--/.sidebar-promo-box-->
</t:if>