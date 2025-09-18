<a [routerLink]="['/product', item.slug]" class="thumb" tabindex="0">
  <img [src]="item.img || 'assets/images/placeholder.jpg'" ... />
</a>
<a [routerLink]="['/product', item.slug]" class="title">{{ item.name }}</a>