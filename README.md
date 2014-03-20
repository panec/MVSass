# MVScss

MVScss takes next step in writing and maintaining CSS code for projects, extending capability of SASS and adding additional level of abstraction to ease development process, extend maintainability and allow closer collaboration between UX, Designers and UI developers. This approach is applicable to different approaches and do not force any CSS approaches like OOCSS, BEM, SMACSS. It's main strength will be shown in CMS environments when we have modular HTML that rarely changes. It optimizes process of creating multiple version of the same component but with different styling.

It consist two logically separated concepts that can be used as standalone modules. First is a pattern of writing and organizing files within project structures that tries to apply MVC pattern principals into CSS / SASS world. Second is a set of functions, mixins and specially designed syntax to extend standard functionality of SASS in writing code that support handling view-port break points by definition.

Before you will dig into details please note that this pattern and set of tools will work in SASS in version 3.3 and newer that is currently available as Release Candidate.

## MVS Pattern

> Model–view–controller (MVC) is a software pattern for implementing user interfaces. It divides a given software application into three interconnected parts, so as to separate internal representations of information from the ways that information is presented to or accepted from the user. The central component, the *model*, consists of application data, business rules, logic, and functions. A *view* can be any output representation of information, such as a chart or a diagram. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants. The third part, the *controller*, accepts input and converts it to commands for the model or view. `Wikipedia`

It will be hard to create fully working version of MVC pattern in SASS, in the end it generates static .css files but some of the principals can be achieved. First start with initial file structure of our project, it will contain our data *model* as well as a *view* that will be stored in `core` folder and our SASS *controller* in `theme` folder. To make this more readable we will be creating css files for two components: *list*, *navigation* and one page *home*. 

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


* `core/model` should contain all the definitions that can be used for styling our components, it should consist CSS attributes that are meaningful from look & feel perspective, this will mean different per component, project or specific requirements and should be a mixture of common sense, experience of the developer and level of knowledge of UX, Designers that we will co-operate with. 

* `core/view` should contain mixins that will make a use of values declared in `core/model` files and create required css declarations within proper css selectors. It also should contain all computation of values, transforms or any additional logic that is used when view for specific version of component is computed.

* `core/_functions.scss` contains all functions used within project, and should include or extend MVS functions.

* `core/_mixins.scss` contains all mixins used within project, and should include or extend MVS mixins.

* `core/_variables.scss` contains all global variables used within project, and should include or extend MVS variables.

* `theme/model` should contain sets of values used for creating different versions of the component.

* `theme/view` should contain calls of mixins from `core/view` with specific sets of model data from `theme/model` within properly nested css selectors.

* `theme/_variables.scss` contains all local variables used within theme, it extends and overwrites settings from `core/_variables.scss`.

## MVS Syntax

### MVS maps & variables

To be able to fully use SASS we need to parametrize all values that we are sending to mixins and functions. We can create a value per css attribute like 

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

but it will create bloated file with hundreds of variables and hundreds of references to those variables. To optimize this process and allow us to easily reuse set of variables we will use new feature available in SASS 3.3 - `maps`.

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

If you want to know more about SASS `maps` please go to [SASS Read me file (stable branch)](https://github.com/nex3/sass/blob/stable/README.md) for more information.

The naming notation follows couple of principals. 

* `map` name corresponds to the component that it describes and the `core` versions have a `_core` suffix. 
* `variable` name contain meaningful text that is "-" ( *dash* ) separated that corresponds to part of the component that describes, then "\_" ( *underscore* ) char for separation between name and css attribute name, if it describe state of the element it contain additional block of text separated by "\_" ( *underscore* )

This way of storing data will allow us to use some functions to extract css attribute name from the variable name so we can by DRY.

### MVS basic notation

In CSS there are two notations of writing values for specific attributes. In most cases there is one value like for `color: #000` but sometimes where are values that contains multiple values for them `border-width: 1px 1px 1px 1px` that can be written in shorthand notation as `border-width: 1px`. The MVS gives extended version of this notation that has build in support for mobile first approach with view port breakpoints. Let us define couple of them, as example I will use Bootstrap breakpoints (taken from [SASS fork](https://github.com/jlong/sass-bootstrap/blob/master/lib/_variables.scss) of it)

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

Let us write the `container_color: #000` in MVS notation but set a different color value for each breakpoint:

```sass
$navigation: (
	container_color: ( #000, ( #000, #00F, #0FF, #FFF ) ),
);
```

It will generate the code that `#000` value will be defined as default, `#00F` will be applied to `screen-sm`, `#0FF` for `screen-md` and `#FFF` for `$screen-lg`. First value within second set of brackets `( #000`  is the same as first value and will throw warning if is not the same. Each breakpoint ( except `$screen-xs` ) has different value so all of them will be generated in final css file.

We can use different variation of that syntax. When we will write declaration in following way:

```sass
$navigation: (
	container_color: ( #000, ( #000, #000, #0FF ) ),
);
```

It will generate the code that `#000` value will be defined as default, because value for `screen-sm` is the same as for `screen-xs` it will be skipped, value `#0FF` will be applied to `screen-md` and because boundaries of media queries are not specific `@media only screen and (min-width: $screen-md)` it will be applied to bigger view ports and will not be part of the css file. Any combination of the following is allowed. If attribute has one value across all breakpoints we use old CSS syntax.

Now let us write `container_border-width:  1px 1px 1px 1px` in MVS notation following the same principal:

```sass
$navigation: (
	container_border-width: ( 1px 1px 1px 1px, ( 1px 1px 1px 1px, 2px 2px 2px 2px, 3px 3px 3px 3px, 4px 4px 4px 4px ) ),
);
```

It will generate the code that `1px 1px 1px 1px` value will be defined as default, `2px 2px 2px 2px` will be applied to `screen-sm`, `3px 3px 3px 3px` for `screen-md` and `4px 4px 4px 4px` for `$screen-lg`. We can mix normal and shorthand notation within declaration but we need to follow rule of dividing value for each breakpoint with ',' char. When value for different breakpoints will be the same it will be skipped like in `container_color: #000` example.

To use this notation in any place of the code we need to call mixin:

```sass
.css-class {
	@include mvs-respond( border-width, map-get( $navigation, container_border-width ) );
}
```

### MVS nth notation

Sometimes we have a need to define different style when the element in nth-child of some parent element. Normally you need to foresee those situations on implementation stage and it is hard to change those values later on, you always have to relate to source file and change nesting. To prevent this situations MVS extends its notation to support nth child selectors. 

To prevent issues with applying values for different breakpoints when they are different we need to define specific version of our `respond-to` function

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

Now we can extend following `container_color: #000` value to be applicable to different nth-child’s:

```sass
$navigation: (
	item_color: ( #000, 
		( #000, #00F, #0FF, #FFF ), 
		(":nth-child(even)", #F00, #FF0, #FFF, #F0F ),
		(":nth-child(1)", #0F0 ),
	),
);
```

It will generate the code that `#000` value will be defined as default, `#00F` will be applied to `screen-sm`, `#0FF` for `screen-md` and `#FFF` for `$screen-lg`. Those values will be overwritten when the `item` will be `even` by following values `#F00` for `screen-xs`, `#FF0` for `screen-sm`, `#FFF` for `screen-md` and `#F0F` for `screen-lg`. And again when the `item` will be first value will be `#0F0` across all breakpoints.

### MVS nth notation traversing

In previous example it can be easy deducted that `item` is a fist child in DOM structure of `container` and it is easy to write selector that will meet it, but what if we need to generate a code for following HTML:

```html
<ul>
	<li>
		<div class="item">
			<span class="title">Title</span>
			...
		</div>
	</li>
	...
</ul>
```

The `nth-child` selector will not work for inner `<span class="title">` because it is always the first child of its parent. To overcome this problem we are using another function of SASS 3.3 that extends `&` functionality and allow to treat it as an array of css selectors. To use this notation in any place of the code we need to call mixin:

```sass
.title {
	@include mvs-respond( border-width, map-get( $navigation, container_border-width ), " li", 1);
}
```

It will inject an `li` css selector between `.title` class selector and any parent css selectors ( take note that `li` is prefixed with " " ( *space* ) to inject it in between and not to append to ). Last parameter: `1` describes how many parent has to be traversed before `li` will be injected.
If we have a situation when there will be multiple parent selectors in sass file we need to define no. of them, it flowing example it will be `2`:

```sass
.item {
	.title {
		@include mvs-respond( border-width, map-get( $navigation, container_border-width ), " li", 2);
	}
}
```

### MVS automatic attributes resolver

To shorthand calling of the `mvs-respond` mixin so it do not have to be called for each variable within map explicitly we can use a function to parse css attribute names from name of the variable we can use following function:

```sass
li {
	@include mvs-respond-map("item_", $navigation, " .list-of-entities-item", 1);
}
```

It will automatically generate code for each value that key is prefixed with `item_`, ends with proper css selector that will be prefixed by "\_" ( *underscore* ) char and do not contains anything between, so `item_is-hovered_color` will be skipped.

### MVS default values

Default value that are used as a reference point should be created in `core/model` folder. Example map that will be describing the `_list.scss` can look like this:

```sass
$core-model-list: (
	//container
	container_background-color             : null,
	container_border-color                 : null,
	container_border-style                 : null,
	container_border-width                 : null,
	container_color                        : null,
	container_margin                       : null,
	container_padding                      : null,
	
	//item 
	item_clear                             : null,
	item_float                             : null,
	item_width                             : null,
	
	//item-link
	item-link_background-color             : null,
	item-link_border-color                 : null,
	item-link_border-style                 : null,
	item-link_border-width                 : null,
	item-link_color                        : null,
	item-link_margin                       : null,
	item-link_padding                      : null,
	//item-link hover state
	item-link_is-hover_text-decoration     : null,
	
	//item-headline
	item-headline_color                    : null,
	item-headline_font-family              : null,
	item-headline_font-size                : null,
	item-headline_font-style               : null,
	item-headline_font-weight              : null,
	item-headline_line-height              : null,
	item-headline_letter-spacing           : null,
	item-headline_margin                   : null,
	//item-headline hover state
	item-headline_is-hover_text-decoration : null,
```

All defined values are `null` because we want to facilitate another function of SASS that skips generating css attributes when they are null, and in case of any checking `@if null` is `false` is sass that is handy when we are adding logic to our values.

### MVS custom values

Within folder `theme/model` should contain a set/sets of values that will be used for generating our custom styled components. Example map that will describe the `_list.scss` can look like this ( it will define border for container with some padding and colour for a link inside )  :

```sass
$theme-model-list: (
	//container
	container_border-color                 : #000,
	container_border-style                 : solid,
	container_border-width                 : 1px,
	container_color                        : #000,
	container_padding                      : 10px,
	
	//item-link
	item-link_color                        : lighten(#000, 20%),
```

We can use any of the values defined in `core/model` folder. This set will be a base for all of custom versions of component within one `theme` folder.

### MVS extending custom values

Within the same file `theme/model/_list.scss` contain different set of values that will define different styles for specific version of component. It should contain only differences between this version and values defined in `$theme-model-list` map but it is not required. The library will resolve the differences and will produce only required css code, but keeping this file small and tidy will increase readability. Example map that will update default theme version will be presented in 2 columns for first three breakpoints and 3 columns for the rest ( and will change border and link colour ):

```sass
$theme-model-list-ver_1: (
	//container
	container_border-color                 : #F00,
	container_border-style                 : dotted,
	
	//item 
	item_clear                             : ( null, ( ":nth-child(3n+4)", null, null, null, left ), ( ":nth-child(2n+3)", left, left, left, null ) ),
	item_float                             : left,
	item_width                             : ( 50%,	( 50%, 50%, 50%, 33.3% ) ),

	//item-link
	item-link_color                        : lighten( #F00, 20% ),
```

### MVS component mixins

To facilitate all that data we need to create a `mixin` per each component in `core/view` that will contain reference to corresponding `core/model` file with simple sass `@import`. It should contain two optional parameters `$model-list` that is a container for `map` with data, and `$is-initial` that will indicate that mixin creates initial structure of styles for component that are static and will not be parametrized.

```sass
@mixin list( $model-list: $core-model-list, $is-initial: false ) {
	@if $is-initial {
		$model-list: map-overwrite( $core-model-list, $model-list );
		$core-model-list: $model-list !global;
	}
	@else {
		$model-list: map-unique( $core-model-list, $model-list );
	}

	ul {
		@include mvs-respond( background-color, map-get ( $model-list, container_background-color ) );
		@include mvs-respond( border-color, map-get ( $model-list, container_border-color ) );
		@include mvs-respond( border-style, map-get ( $model-list, container_border-style ) );
		@include mvs-respond( border-width, map-get ( $model-list, container_border-width ) );
		@include mvs-respond( color, map-get ( $model-list, container_color ) );
		@include mvs-respond( margin, map-get ( $model-list, container_margin ) );
		@include mvs-respond( padding, map-get ( $model-list, container_padding ) );
	}

	li {
		@if $isInitial {
			display: block
		}

		@include mvs-respond-map( "item_", $model-list );

		a {
			@include mvs-respond-map( "item-link_", $model-list, " li", 1 );
		}
	}
}
```

### MVS component mixin values resolving

```sass
@if $is-initial {
	$model-list: map-overwrite( $core-model-list, $model-list );
	$core-model-list: $model-list !global;
}
@else {
	$model-list: map-unique( $core-model-list, $model-list );
}
```

This creates a map with values that will be used within body of the component mixin.
* `$model-list: map-overwrite( $core-model-list, $model-list );` is a wrapper for sass `map-merge`, it works exactly the same but outputs warnings on console when `$model-list` adds values for keys that do not exist in `$core-model-list`.
* `$core-model-list: $model-list !global;` stores default theme values for next instances of the component within theme, the `!global` suffix is required by Sass 3.3.
* `$model-list: map-unique( $core-model-list, $model-list );` merges two list but outputs only the values that ware defined in `$model-list` and have different value that corresponding keys in `$core-model-list` and also produces warning on console.

### MVS initial component values

```sass
li {
	@if $isInitial {
		display: block
	}
}
```

This creates css attribute with value that will be exact the same for all version of component and will not be a part of any of the map parameters, by decorating it with the condition block it will be added only once to output file.

### MVS respond

```sass
ul {
	@include mvs-respond( background-color, map-get ( $model-list, container_background-color ) );
	@include mvs-respond( border-color, map-get ( $model-list, container_border-color ) );
	@include mvs-respond( border-style, map-get ( $model-list, container_border-style ) );
	@include mvs-respond( border-width, map-get ( $model-list, container_border-width ) );
	@include mvs-respond( color, map-get ( $model-list, container_color ) );
	@include mvs-respond( margin, map-get ( $model-list, container_margin ) );
	@include mvs-respond( padding, map-get ( $model-list, container_padding ) );
}
```

Generates code for each of the values defined in `$model-list` for keys `container_(...)`. This code is correct but it is not easy to maintain, it requires adding a `@import mvs-respond` every time we add new key to default map. This function is ideal when we want to create values in-line or when we will compute something and result relies on values defined in map:

```sass
ul {
	@include mvs-respond( width, ( $column-width * 12 - $gutter-width, ( $column-width * 12 - $gutter-width, $column-width * 10 - $gutter-width, $column-width * 8 - $gutter-width ) ) );
}
```

### MVS respond map

Instead of calling `mvs-respond` multiple times we can use `mvs-respond-map` that will use the key naming convention and it will create all the css attributes for us. The example for 'ul' could be written as follows, and it will generate the same code:

```sass
ul {
	@include mvs-respond-map( "container_", $model-list );
}
```

### MVC parent injecting

When we want to support `:nth-child` notation we need to pass additional optional parameters to `mvs-respond` and `mvs-respond-map` mixins. String with css selector to be appended/injected, and number of parents to traverse. For the following code:

```sass
li {
	a {
		@include mvs-respond-map( "item-link_", $model-list, "", 1 );
	}
}
```

the value will be appended to parent that is `1` level up - in this case `li` and will work properly because it is nth child of `ul`.
The same can be achieved without nesting `a` within `li` selector by writing un-nested code:

```sass
a {
	@include mvs-respond-map( "item-link_", $model-list, " li", 1 );
}
```

In this case the `" li"` string with proper selector will be injected between parent selector that is `1` level up and nth syntax will be added to that newly created selector - `li:nth-child(2n) a`

### MVS value computation

Sometimes there is a need to compute some values, like `height` or `top` for absolute elements that needs to calculate based on map values. To do it we can use a `mvs-call` function. It calls defined function against each item within mvs syntax notation, all combinations are supported ( **currently nth syntax is not supported** ).

```sass
@function some-function($element) {
    @return $element * 2;
}

$item_width: 50%, ( 50%, 50%, 50%, 33.3% );

$item_width_multiplied: mvs-call( $item_width, some-function );
```

This will create new variable `$item_width_multiplied` that value will be `100%, ( 100%, 100%, 100%, 66.6% )`. Default sass, `compass` or any other functions that gets one parameter are allowed. 

### MVS matrix sum

When there is a need to compute multiple values at once for example we need to sum `border-width`, `padding` and `line-height` to know how much space component will take we have function to sum all values within all variables. To do it we can use 

```sass
$border-width : 1px 2px 1px 2px, ( 5px 6px 5px 6px , 9px 10px 9px 10px );
$padding      : 3px 4px 3px 4px, ( 7px 8px 7px 8px, 11px 12px 11px 12px );

$matrix_1     : mvs-matrix-sum( 4, $border-width, $padding );
```

`mvs-matrix-sum` support all possible combination of supplied parameters, it does not matter if one value contains one shorthand value like `$border-width : 1px` or all four, or like this case the mvs syntax for two breakpoints, it will generate values for all supported breakpoints. Also the `mvs-matrix-sum` requires two parameters. First defines how many numbers should be processed per value, in case of `border-width`, `padding` it can be four ( probably it will be updated to detect this internally ). Second is list of comma separated list of mvs syntaxes and should be longer then one.
Value of `$matrix_1` will be: `4px 6px 4px 6px, (12px 14px 12px 14px, 20px 22px 20px 22px, 20px 22px 20px 22px, 20px 22px 20px 22px )`.

To be able to compute height across different breakpoints we will have to transform `4px 6px 4px 6px` into single value ( sum top and bottom values ) - `8px` and call `mvs-matrix-sum` again with `line-height` values.

### MVS creating custom version

Within `theme/view` we create files that refer corresponding files from `theme/model` and `core/view` with `@import`. It should contain all the main css classes that are use to indicate our components. For each of the version we create different css class. Example call can look like:

```sass
.list {

	@include list( $theme-model-list, $is-initial: true );

	&.red-columns {
		@include component-list-of-entities( $theme-model-list-ver_1 );
	}
```

We can extend this even further and we can create a specific version by merging in-line values with maps that are already defined. Imagine that we have a `list` component on home page that should have no border and it should extend version of `.list.red-columns`. We can do it be calling following code:

```sass
.page-home {
	.list.red-columns
 	{
		@include component-list-of-entities( ( container_border-color: transparent, container_border-width: 0 ) );
	}
}
```

It will automatically set proper values, checks if they are different from default and if they are they will be added to output css.
