## Intro

The page layout is determined by the CSS declarations.

The blue and red dashed lines are layout helpers and are not displayed in the final PDF.

To export the PDF simply click on the pink "GENERATE PDF" button.

This demo project was entirely coded with this very app.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Page specifc styles

Pages car get specific styles by targeting the page number

Here we changed the background color, font color, and font alignment.

We also positioned the `<section>` container at the bottom of the page.

Each heading generates a `<section>` tag that wraps all the contents before the next heading (of the same or higher order). The class of the section is generaed based on the heading text.

`## Page specifc styles`

gives the classes

`page-specifc-styles page-specifc-styles-2 d-2`

## Images

This preview version (when used online) can only load remote images.

![Gustave Doré by Nadar](https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Photograph_of_Gustave_Dor%C3%A9_by_Nadar%2C_between_1856_and_1858.jpg/1280px-Photograph_of_Gustave_Dor%C3%A9_by_Nadar%2C_between_1856_and_1858.jpg "Gustave Doré by Nadar")

## Full screen images

![Le petit poucet by Gustave Doré](https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Barbebleue.jpg/960px-Barbebleue.jpg?20180511035022 "Le petit poucet by Gustave Doré")


## Columns

### Two columns

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. 

### Three columns

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

## Tables and lists

### Unordered list

* A bullet point thingy
* More things on the todo list
* One more, that's the last one **actually**

### Ordered lits

In this project the css styles ordere lists as tables. In markdown lists are much easier to read than tables, therefore, with appropriate styling, they can be used to display one column tables.

1. CSS is not a substitute for designing
2. It's juust another tool for layout design
3. I really like it because it reminds me of letterpress

### Simple table

Hang on! I just realized my markdown processor has a bug with processing tables! It worked yesterday :( I'll get back to you on this )


| # | Note |
| :--- | :--- |
| **1** | CSS is not a substitute for designing |
| **2** | It's juust aniother tool for layout design |
| **3** | I really like it because it reminds me of letterpress |

## Blockquotes

> Form and function are one.
