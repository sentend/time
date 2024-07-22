# Code guidelines

## File structure

- pages/ // think of a page as a module what encaplulates everything inside it
  - XXXPage/
    - XXXPage.tsx
    - utils/
    - hooks/
    - ui/
    - widgets/
- entities // components having model/module/use-case context but used more than once in the modules
  - ui
  - widgets
  - utils
  - ...
- shared // general purpose components
  - ui
  - utils
  - types
  - i18n
  - hooks
  - ...

## Architectural guidelines

- only pages and widgets...
  - can contain business logic
  - have access to the store
  - can use react query / fire requests / use store actions
- only pages can access router / url params
- all pages in a flat file structure
- widgets should not include other widgets -> flat structure (exeption widgets from entities)
- avoid using contexts. use store for pages/widgets and params passing for UI

## Code "reade for review" guidelines

- no TODOs what are not converted to tickets
- no commented "dead" code
