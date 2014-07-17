<t:if test="length > 0">
  <div class="comment-list list-items">
    <h2>Comments</h2>
    <t:list>
      <div class="list-item">
        <div class="list-item-description"><t:value id="body">Comment here</t:value></div>
          <div class="list-item-by">Posted by <t:value id="nickname" null="Anonymous">Nickname</t:value> on <t:value id="creationDate" format="5">Created</t:value></div>
        <div class="clearfix"></div>
      </div><!-- /.list-item -->
    </t:list>
  </div><!-- /.comment-list -->
</t:if>