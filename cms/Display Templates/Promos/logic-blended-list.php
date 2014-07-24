<div class="sidebar-promo-box promo">
  <div class="sidebar-promo related-content list-items-container">
    <h6>Related Content</h6>
    <div class="list-items">
      <!-- news -->
      <t:include id="templatelist-543742609" />

      <!-- partners -->
      <t:include id="templatelist-543744325" />

      <!-- videos -->
      <t:include id="templatelist-543744452" />

      <!-- client-stories -->
      <t:include id="templatelist-543744842" />

      <!-- campaigns -->
    <t:if test="param.for == 'web'">
      <!-- web-pages -->
      <t:include id="templatelist-543745472" />

      <!-- section-pages -->
      <t:include id="templatelist-543745527" />
    </t:if>
    </div>
  </div>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="https://raw.githubusercontent.com/Sjeiti/TinySort/master/src/jquery.tinysort.js"></script>
<script>
  var $items = $(".list-items>.list-item");
  $items.tsort("span.date", {order:"desc"});
</script>