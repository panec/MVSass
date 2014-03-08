# MVScss

MVScss takes next step in writting and maintainign CSS code for projects, extending cabilities of SASS and adding additional level of abstraction to ease development process, extend maintability and allow closer colaboration between UX, Designers and UI developers. This approach is aplicable to diffrent approaches and do not force any CSS aproaches like OOCSS, BEM, SMACSS. It's main strength will be shown in CMS environments when we have modular HTML that rarly changes. It optimizes process of creating multiple version of the same component but with different styling.

It consist two logically seperated concepts that can be used as standalone modules. First is a pattern of writting and oryginizing files withing project structures that tries to apply MVC pattern principals into CSS / SASS world. Second is a set of functions, mixins and specialy designed syntax to extend standard functionality of SASS in writting code that support handling viewport breake points by definition.

Before you will dig into details please note that this pattern and set of tools will work in SASS in version 3.3 and newer that is currently available as Release Canditate.

## MVS Pattern

> Model–view–controller (MVC) is a software pattern for implementing user interfaces. It divides a given software application into three interconnected parts, so as to separate internal representations of information from the ways that information is presented to or accepted from the user. The central component, the *model*, consists of application data, business rules, logic, and functions. A *view* can be any output representation of information, such as a chart or a diagram. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants. The third part, the *controller*, accepts input and converts it to commands for the model or view. `Wikipedia`

It will be hard to create fully working version of MVC pattern in SASS, in the end it generates static .css files but some of the principals can be achieved. First start with initial file structure of our project, it will contain our data *model* as well as a *view* that will be stored in `core` folder and our SASS *controller* in `theme` folder. To make this more readible we will be creating css files for two components: *list*, *navigation* and one page *home*. 

	|- core
	    |   |- model
	    |       |- components
	    |       	|- _list.scss
	    |       	|- _navigation.scss
	    |       |- pages
    	|       	|- _home.scss
	    |	|- view
	    |       |- components
	    |       	|- _list.scss
	    |       	|- _navigation.scss
	    |       |- pages
    	|       	|- _home.scss
	    |- _functions.scss
	    |- _mixins.scss
	    |- _variables.scss
    |- theme
     	|   |- model
	    |      |- components
	    |       	|- _list.scss
	    |       	|- _navigation.scss
	    |       |- pages
    	|       	|- _home
	    |	|- view
	    |		|- components
	    |       	|- list.scss
	    |       	|- navigation.scss
	    |       |- pages
    	|       	|- home.scss
	    |- _variables.scss


* `core/model` should contain all the definitions that can be used for styling our components, it should consist CSS attributes that are meaningfull from look & feel perspective, this will mean different per component, project or specific requirenments and should be a mixture of common sence, experience of the developer and level of knowledge of UX, Designers that we will co-operate with. 

* `core/view` should contain mixins that will make a use of values declared in `core/model` files and create required css declarations withing proper css selectors. It also should contain all computation of values, transforms or any additional logic that is used when view for specific version of component is computed.

* `core/_functions.scss` contains all functions used within project, and should include or extend MVS functions.

* `core/_mixins.scss` contains all mixins used within project, and should include or extend MVS mixins.

* `core/_variables.scss` contains all global variables used within project, and should include or extend MVS variables.

* `theme/model` should contain sets of values used for creating different versions of the componet.

* `theme/view` should contain calls of mixins from `core/view` with specific sets of model data from `theme/model` within properly nested css selectors.

* `theme/_variables.scss` contains all local variables used within theme, it extends and overwrites settings from `core/_variables.scss`.

## MVS Syntax

### MVS maps & variables

To be able to fully use SASS we need to parametrize all values that we are sending to mixins and funtions. We can create a value per css attribute like 

```sass
$navigation-container_color: #000;
$navigation-container_border-color: #000;
$navigation-container_border-styles: solid;
$navigation-container_border-width: 1px;

$navigation-item_color: #000;
$navigation-item_border-color: #000;
$navigation-item_border-styles: solid;
$navigation-item_border-width: 1px;

$navigation-item_is-hovered_color: #EEE;
```

but it will create bloated file with hundreds of variables and hundreds of references to those variables. To optimize this process and allow us to easyli reuse set of variables we gona use new feature available in SASS 3.3 - `maps`.

```sass
$navigation: (
	container_color: #000,
	container_border-color: #000,
	container_border-styles: solid,
	container_border-width:  1px 1px 1px 1px,

	item_color: #000,
	item_border-color: #000,
	item_border-styles: solid,
	item_border-width:  1px 1px 1px 1px,

	item_is-hovered_color: #EEE,
);
```

If you want to know more about SASS `maps` please go to [SASS Readme file (stable branch)](https://github.com/nex3/sass/blob/stable/README.md) for more information.

The naming notation follows couple of principals. 

* `map` name corresponds to the component that it describes and the `core` versions have a `_core` suffix. 
* `viariable` name contain meaningfull text that is '-' seperated that corresponds to part of the component that describes, then '\_' char for seperation between name and css attribute name, if it describe state of the element it contain additional block od text seperated by '\_'

This way of storing data will allow us to use some functions to extract css attribute name from the variable name so we can by DRY.

### MVS basic notation

In CSS there are two notations of writting values for specific attributes. In most cases there is one value like for `color: #000` but sometimes where are values that contains multiple values for them `border-width: 1px 1px 1px 1px` that can be written in shorthand notation as `border-width: 1px`. The MVS gives extended version of this notation that has build in support for mobile first approach with viewport breakepoints. Let us define couple of them, as example I will use Bootstrap breakepoints (taken from [SASS fork](https://github.com/jlong/sass-bootstrap/blob/master/lib/_variables.scss) of it)

```sass
// Media queries breakpoints
// --------------------------------------------------
// Extra small screen / phone
$screen-xs:                  480px;
// Small screen / tablet
$screen-sm:                  768px;
// Medium screen / desktop
$screen-md:                  992px;
// Large screen / wide desktop
$screen-lg:                  1200px;

@mixin respond-to($size) {
	@if $size == screen-xs {
		@media only screen and (min-width: $screen-xs) { @content; }
	}
    @else if $size == screen-sm {
        @media only screen and (min-width: $screen-sm) { @content; }
    } 
    @else if $size == screen-md {
        @media only screen and (min-width: $screen-md) { @content; }
    }
    @else if $size == screen-lg {
        @media only screen and (min-width: $screen-lg) { @content; }
    }
}
```

Let us write the `container_color: #000` in MVS notation but set a different color value for each breake point:

```sass
$navigation: (
	container_color: ( #000, ( #000, #00F, #0FF, #FFF ) ),
);
```

It will generate the code that `#000` value will be defined as default, `#00F` will be applied to `screen-sm`, `#0FF` for `screen-md` and `#FFF` for `$screen-lg`. First value withing second set of brackets `( #000`  is the same as first value and will throw warning if is not the same. Each breake point ( except `$screen-xs` ) has different value so all of them will be generated in final css file.

We can use different variation of that syntax. When we will write declaration in following way:

```sass
$navigation: (
	container_color: ( #000, ( #000, #000, #0FF ) ),
);
```

It will generate the code that `#000` value will be defined as default, because value for `screen-sm` is the same as for `screen-xs` it will be skipped, value `#0FF` will be applied to `screen-md` and because boundries of media queries are not specific `@media only screen and (min-width: $screen-md)` it will be applied to bigger viewports and will not be part of the css file. Any combination of the following is allowed. If attribute has one value across all breakepoints we use old CSS syntax.

Now let us write `container_border-width:  1px 1px 1px 1px` in MVS notation followind the same principal:

```sass
$navigation: (
	container_border-width: ( 1px 1px 1px 1px, ( 1px 1px 1px 1px, 2px 2px 2px 2px, 3px 3px 3px 3px, 4px 4px 4px 4px ) ),
);
```

It will generate the code that `1px 1px 1px 1px` value will be defined as default, `2px 2px 2px 2px` will be applied to `screen-sm`, `3px 3px 3px 3px` for `screen-md` and `4px 4px 4px 4px` for `$screen-lg`. We can mix normal and shorthand notation withing declaration but we need to follow rule of deviding value for each breakepoint with ',' char. When value for different breakepoints will be the same it will be skipped like in `container_color: #000` example.

To use this notation in any place of the code we need to call mixin:

```sass
.css-class {
	@include mvs-respond( border-width, map-get( $navigation, container_border-width ) );
}
```

### MVS nth notation

Sometimes we have a need to define different style when the element in nth-child of some partent element. Normally you need to forsee those situations on implementation stage and it is hard to change those values later on, you always have to relate to source file and change nesting. To prevent this situations MVS extends its notation to support nth child selectors. 

To prevent issues with applying values for different breakepoints when they are different we need to define specific version of our `respont-to` function

```sass
@mixin respond-to-specific($size) {
    @if $size == screen-xs {
        @media only screen and (max-width: $screen-sm - 1) { @content; }
    }
    @else if $size == screen-sm {
        @media only screen and (min-width: $screen-sm) and (max-width: $screen-md - 1) { @content; }
    } 
    @else if $size == screen-md {
        @media only screen and (min-width: $screen-md) and (max-width: $screen-lg - 1) { @content; }
    }
    @else if $size == screen-lg {
        @media only screen and (min-width: $screen-lg) { @content; }
    }
}
```

Now we can extend following `container_color: #000` value to be aplicable to different nth-childs:

```sass
$navigation: (
	item_color: ( #000, 
		( #000, #00F, #0FF, #FFF ), 
		(":nth-child(even)", #F00, #FF0, #FFF, #F0F ),
		(":nth-child(1)", #0F0 ),
	),
);
```

It will generate the code that `#000` value will be defined as default, `#00F` will be applied to `screen-sm`, `#0FF` for `screen-md` and `#FFF` for `$screen-lg`. Those values will be overwritten when the `item` will be `even` by following values `#F00` for `screen-xs`, `#FF0` for `screen-sm`, `#FFF` for `screen-md` and `#F0F` for `screen-lg`. And again when the `item` will be first value will be `#0F0` across all breakepoints.

### MVS nth notation traversing

In previous example it can be easy deducted that `item` is a fist child in DOM structure of `container` and it is easy to write  selector that will meet it, but what if we need to generate a code for following HTML:

```html
<ul>
	<li>
		<div class="item">
			<span class="title">Title</span>
			...
		</div
	</li>
	...
</ul>
```

The `nth-child` selector will not work for inner `<span class="title">` because it is always the first child of its parent. To overcome this problem we are using another function of SASS 3.3 that extends `&` functionality and allow to treat it as a array of css selectors. To use this notation in any place of the code we need to call mixin:

```sass
.title {
	@include mvs-respond( border-width, map-get( $navigation, container_border-width ), " li", 1);
}
```

It will inject an `li` css selector between `.title` class selector and any parent css selectors ( take note that `li` is prefixed with " " to inject it in between and not to appedn to ). Last parameter: `1` describes how many parent has to be treversed before `li` will be injected.
If we have a situation when there will be multiple parent selectors in sass file we need to define no. of them, it folowing example it will be `2`:

```sass
.item {
	.title {
		@include mvs-respond( border-width, map-get( $navigation, container_border-width ), " li", 2);
	}
}
```

### MVS automatic atributes resolver

To shorthand calling of the `mvs-respond` mixin so it do not have to be called for each variable within map explicitly we can use a function to parse css attribute names from name of the variable we can use following function:

```sass
li {
	@include mvs-respond-map("item_", $navigation, " .list-of-entities-item", 1);
}
```

It will automatically generate code for each value that key is prefixed with `item_`, ends with proper css selector that will be prefixed by '\_' char and do not contains anything between, so `item_is-hovered_color` will be skipped.

### MVS declaring default values

(...)

### MVS extending custom values

(...)

### MVS component mixins

(...)

### MVS initial component values

(...)

### MVS value computation

(...)
