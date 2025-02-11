svg 描边其实就是利用了一种技巧
```css
stroke-dasharray: 10;
```

当设置 `stroke-dasharray` 时，svg 的路径就会变为 实线 虚线 实现 虚线，看起来就是  `- - - -`, 然后每段实线和虚线的宽度都是 10

然后设置 dashoffset

```css
stroke-dasharray: 10;
stroke-dashoffset: 10;
```

当 dashoffset 设置为和 dasharray 一样的值时，等于 path 向左移动了一个实线的距离，也就变成了 -` - - -`, 

由此我们可以推导，当 dasharray 的值和 path 的总长度一致时, 那么实线内容也就是 path 的总长了
`[————]    ————`

然后我们让路径向左移动 path 的长度，那么此时可见部分就是虚线部分

大概是这样的 `————[    ]————`

所以，我们的动画就是让 offset 从 pathTotalLength 开始，运动到某一个指定的 offset 即可

```css
.svg {
  stroke: red;
  stroke-width: 3;
  stroke-linecap: round;

  stroke-dasharray: var(--svg-l);
  stroke-dashoffset: var(--svg-l);

  animation: stroke-dash 3s linear forwards;
}

@keyframes stroke-dash {
  from {
    stroke-dashoffset: var(--svg-l);
  }
  to {
    stroke-dashoffset: var(--svg-progress, 0);
  }
}
```
