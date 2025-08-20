## Change Log

#### 0.1.40
- Add Liquid target language

#### 0.1.39
- Fix: sort ruby `.rb` files
- Match prefixes inside parentheses

#### 0.1.38

- Add Razor target languages ([rintheo](https://github.com/rintheo))
- Add contributing docs

#### 0.1.37

- Add `cn(` as default prefix ([milksense](https://github.com/milksense))

#### 0.1.36

- Add EJS target language

#### 0.1.35

- Add MDX target language

#### 0.1.34

- Add Blade target language

#### 0.1.33

- Add Ruby target language ([asgerb](https://github.com/asgerb))
  - Support for Rails View Components 

#### 0.1.32

- Add PHP Blade target language

#### 0.1.31

- Add ERB target language

#### 0.1.30

- Add `sortOnSave` setting to toggle sorting on file save
- Add `Tailwind Sorter: Sort` command to sort file manually
- Allow tailwind classes with `_` prefixes to sort as normal

#### 0.1.20

- Fix: sort custom classes containing a tailwind substring to end
- Allow `>` child selectors inside sorted strings
- Better sorting for classes with chained pseudos
- Add missing classes: group-has, peer-has, and visible

#### 0.1.11

- Add Twig target language

#### 0.1.10

- Add Svelte target language
- Fix: sort `not-` classes that are prefixed

#### 0.1.0

- Fix: keep non-tailwind classes sort order, rather than sorting alphabetically 
- Handle `not-` classes
- Add TailwindCSS v4.0 classes, including: "data-", "@container", and "bg-linear"
- Add missing classes: "forced-color-adjust", "fill", "backdrop", etc.

### 0.0.91

- Add PHP target language ([vanbasx](https://github.com/vanbasx))

### 0.0.90

- Support for @apply syntax
- Add CSS and SCSS target languages

### 0.0.84

- Fix: stop empty strings from preventing class sorting

### 0.0.83

- Add Rust target language

### 0.0.82

- Add Astro target language

### 0.0.81

- Fix: allow for brackets/spaces before/after prefixes

### 0.0.8

- Support for additional prefixes ex. `twMerge(`, `cva(` and `clsx(`
- Add missing classes: ring, ring-inset, ring-offset to borders category

### 0.0.72

- Fix: ignore dynamic syntax inside quotes

### 0.0.71

- Add elixir and phoenix-heex target languages

### 0.0.7

- Better comments/code documentation
- Config validation
- Prevent sorting dynamic alpinejs

### 0.0.6

- Fix: no longer breaks Nunjacks, Vue

### 0.0.3 - 0.0.5

- Documentation

### 0.0.2

- Fix issue grabbing VS Code config
- Add missing classes: hidden, inline, space-x/y, bg-repeat, underline, capitalize, etc.

### 0.0.1

- Initial release
