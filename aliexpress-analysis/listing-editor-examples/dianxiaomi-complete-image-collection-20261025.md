# 店小秘产品图片完整采集规则 / Dianxiaomi complete image collection
Updated: 2026-10-25. User-approved workflow. Applies to product editor image downloads.

## 固定约定 / Mandatory convention
用户说“下载产品图区域图片”时，下载该区域全部图片：已勾选、未勾选、重复图、同图不同清晰度版本均保留；按页面展示顺序逐项编号。不得将“已选6张”解释为全部图片。不能去重、跨区域合并或因文件名相同而覆盖。
When asked to download the product image area, collect every displayed occurrence, selected or unselected, including duplicates and alternate CDN renditions, in UI order. Selected count is not total count. Never silently deduplicate.

## 实测方法 / Verified approach
1. 核对 Chrome profile、编辑页网址、商品来源和商品 ID。现有未保存编辑页不得刷新或跳转；不要点击保存、移入待发布、发布。打开图片需要另开标签页。
2. 从页面 DOM 读取已展示图片元素的 currentSrc/src、尺寸、区域、展示顺序及选中状态。这是读取 DOM，不是读取私有应用状态或调用隐藏接口。
3. 本次页面的商品缩略图结构是 .img-out.dxm-preview-img img；产品图外框 style 包含 120px，SKU 外框包含 78px。该结构仅为本次观测，今后必须重新观察 DOM，不能假设选择器永久有效。排除加载 GIF、添加图片按钮等非产品图，但不要排除真实重复图。
4. 如果存在“查看更多”，必须点击展开再计数。本次就是收起18张、展开19张；未展开时报告18张为全量是错误的。与页面计数/人工数目核对，未核实只能报告已观察的数量，不能称为全量。
5. 本次直接使用读出的 CDN 图片 URL 下载到本地，编号文件名，每一位置单独保存。保留原 URL 查询参数，不擅自移除缩略参数或称作最高分辨率原图。无需改变任何勾选状态。
6. “导出勾选图片”不能保证得到所有产品图片。本次导出 ZIP 有12个文件；产品图收起时18个，点击“查看更多”后实际19个图片位置，不能用 ZIP 条目数作该区域全量证明。
7. 下载后核对文件数、JPEG/PNG格式、解码尺寸及非零大小，记录失败。保存区域、位置、URL、文件名、大小、尺寸、SKU关联的 manifest。重复图也必须各自留文件。

## 详情页 / Description images
在 PC 端描述工具栏切换“源码”，只读取源码文本，不改写。按 HTML 中 img 出现顺序记录全部 src（保留重复）；下载每一位置。完成读取后切回原预览模式。不要用父页面 document 的 iframe.contentDocument 空结果推断详情页没图；编辑器 iframe 可能跨源或沙盒化。优先使用可见源码文本，不能读取隐藏应用变量或内部接口。
本次已观测 PC 端7个 img；第3与第6位置引用同一图，依然保留两份。移动端“不填写无线端描述”已选中，没有独立移动描述图片集。

## SKU 图 / Variant images
按每个实际变种选项保存关联图片、名称、顺序。相同图片用于多个变种时仍按选项留多份。区分“选项图片”和“变种表格再次显示的同一选项图片”，不将同一 SKU 在两处显示误报为两个变种。可额外保留所有 DOM 图片出现记录用于审计。
本次6个SKU选项，选项区6次、表格6次，共12处显示；是6个选项，不是12个变种。

## 输出 / Outputs
每个产品独立、每次新版本有时间戳。三类各有 originals / english：
- product_images / 产品图（全部选中和未选中）
- detail_images / 详情页图（按源码顺序）
- sku_images / SKU规格图（按选项逐一）
中文与英文文件名并列；保留 originals，不覆盖之前版本。每张英文图有来源映射和下载链接；最终图片按上传要求小于2MB。翻译只改文字，保持产品形状、颜色、接口、数量不变；无中文图片可原样复制并注明无需翻译。重复原图可以复用同一英文成果，但每个位置均需独立文件。原文性能、认证或品牌宣称有疑点时记录供用户核对，不能把第三方宣称当成自有检测结果。

## 安全边界 / Boundaries
本流程不需要修改勾选状态，不保存/发布产品，不绕过验证码/访问控制，不使用IP轮换、代理规避封锁或隐藏接口。公开仓库只放通用流程和不含敏感信息的示例；不上传 cookies、账号、带身份参数分享链接、浏览历史、私有后台数据。
