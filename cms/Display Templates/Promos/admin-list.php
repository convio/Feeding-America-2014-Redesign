<t:if test="length > 0">
  <table class="compact">
    <thead>
      <tr>
        <th>Admin Title</th>
        <th>Promo Headline</th>
        <th>Promo Type</th>
        <th>Conditional Group(s)</th>
        <th>Section/Category</th>
        <th>Date</th>
        <th>Edit link</th>
      </tr>
    </thead>
    <tbody>
      <t:list>
        <tr>
        <td><a href="${url}">${title}</a></td>
        <td><t:if test="!isNull(headline)">${headline}</t:if><t:else>-none-</t:else></td>
        <td>${promo_type}</td>
        <td>${promo_conditional_logic}</td>
        <td>${promo_section}</td>
        <td>${promo_date}</td>
        <td><a href="https://cmsadmin30.convio.net/admin/item/actions/properties-edit.jsp?itemID=${itemid}">Edit</a></td>
      </tr>
      </t:list>
    </tbody>
  </table>
  <t:include id="pagination-546859003" />
</t:if>
<t:else>
  <p>No items</p>
</t:else>