# AliExpress listing editor example — redacted

Captured from a Dianxiaomi AliExpress editor page on 2026-10-23. This is a structural example for future Codex work, not a listing export.

## Redaction

The source editor snapshot contains private supplier share tokens, procurement/cost values, inventory, and internal SKU codes. Those fields are intentionally omitted from this public-repository example. The complete read-only snapshot remains local on the seller's computer.

## Form structure captured

- Basic information: shop, product title, category, source URL.
- Attributes: brand, origin, product type/model/pipe-parts, and custom attributes.
- Product information: six main images, marketing images, variant options, SKU images, price/cost/income, stock, weight, package dimensions, logistics attributes, EAN, and seller SKU code.
- Description: PC description source and mobile description editor.
- Packaging: package weight, custom-weight toggle, freight weight increment rule, and package dimensions.
- Templates and compliance: freight/service templates, customs attributes, tariff setting, manufacturer, and EU/Turkey responsible-person fields.

## Observed SKU validation rule

The rejected buyer-facing SKU option name was too long and contained punctuation. The error stated that SKU names may contain English letters, numbers, and spaces only, with a maximum length of 20 characters. Avoid punctuation such as periods, slashes, quotation marks, and hyphens. Validate each final label's character count.

## Example compact variant labels

These are examples for a filter cartridge with a 1/2-inch threaded option, a 1/4-inch stem option, optional elbow fittings, and 3/6/12-piece packs. Check compatibility and included fittings against the actual goods before use.

| Connection | 3-pack | 6-pack | 12-pack |
|---|---|---|---|
| 1/2-inch threaded | Half Inch Thread 3P | Half Inch Thread 6P | Half Inch Thread 12P |
| 1/4-inch stem, no fitting | Quarter Stem NF 3P | Quarter Stem NF 6P | Quarter Stem NF 12P |
| 1/4-inch stem, elbow | Quarter Stem Elb 3P | Quarter Stem Elb 6P | Quarter Stem Elb 12P |
| Dual thread and stem, no fitting | Dual T S NoFit 3P | Dual T S NoFit 6P | Dual T S NoFit 12P |
| Dual thread and stem, elbow | Dual T S Elb 3P | Dual T S Elb 6P | Dual T S Elb 12P |

All labels above use only English letters, digits, and spaces, and are at most 20 characters. Abbreviation key: NF = no fitting; Elb = elbow; NoFit = no fitting; T S = thread plus stem; 3P/6P/12P = pack quantity. Put the full connection-size legend in the product description or an explanatory image so buyers can decode the abbreviations. The listing editor's option structure may prevent splitting connection and quantity into separate attributes.

## Important validation follow-up

A separate logistics validation message required custom package weight to be a numeric value from 0.001 to 70.00 in the editor's configured unit. Enter the actual packed weight as a number only; do not use this note as a substitute for weighing the package.
