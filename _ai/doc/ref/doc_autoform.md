================
CODE SNIPPETS
================
TITLE: Setting up AutoForm Development Environment
DESCRIPTION: These commands are used to initialize and start the development environment for the AutoForm monorepo. `npm install` installs dependencies, and `npm run dev` starts the development server for the documentation and package.

SOURCE: https://github.com/vantezzen/autoform/blob/main/README.md#_snippet_2

LANGUAGE: bash
CODE:

```
npm install
npm run dev
```

---

TITLE: Starting the Next.js Development Server (Bash)
DESCRIPTION: This snippet shows the common commands used to start the local development server for a Next.js project using various package managers (npm, yarn, pnpm, or bun). Running one of these commands will typically launch the server on http://localhost:3000.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/web/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---

TITLE: Creating AutoForm with MUI and Zod (TSX)
DESCRIPTION: Demonstrates how to initialize and render an AutoForm component using the Material UI integration and Zod for schema validation. It shows basic setup with schema definition and an onSubmit handler.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_0

LANGUAGE: tsx
CODE:

```
import { AutoForm } from "@autoform/mui";
import { ZodProvider } from "@autoform/zod";

const mySchema = z.object({
  // ...
});
const schemaProvider = new ZodProvider(mySchema);

function MyForm() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data, form) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Handling AutoForm Submission with onSubmit (TSX)
DESCRIPTION: Shows the recommended method for accessing validated form data by using the `onSubmit` prop. The provided callback receives the validated data and the react-hook-form instance, allowing further processing or control.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_2

LANGUAGE: tsx
CODE:

```
<AutoForm
  onSubmit={(data, form) => {
    // Do something with the data
    // Data is validated and coerced with zod automatically
    // You can use the "form" prop to access the underlying "react-hook-form" instance
    // for further information and control over the form
  }}
/>
```

---

TITLE: Installing AutoForm and Zod Provider
DESCRIPTION: Install the new AutoForm library components via shadcn/ui and the specific Zod provider package using npm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/migration.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
npx shadcn@latest add https://raw.githubusercontent.com/vantezzen/autoform/refs/heads/main/packages/shadcn/registry/autoform.json
npm install @autoform/zod
```

---

TITLE: Installing Dependencies with PNPM
DESCRIPTION: This command uses the PNPM package manager to install all required project dependencies. It reads the dependencies from the package.json file and sets up the project environment for development or building.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/README.md#_snippet_0

LANGUAGE: Shell
CODE:

```
pnpm i
```

---

TITLE: Installing @autoform/joi package with npm
DESCRIPTION: Installs the @autoform/joi package using npm, making it available for use in your project.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/joi/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/joi
```

---

TITLE: Adding a Submit Button to AutoForm with withSubmit (TSX)
DESCRIPTION: Shows how to easily include a default submit button within the AutoForm component by simply adding the `withSubmit` boolean prop.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_5

LANGUAGE: tsx
CODE:

```
<AutoForm
  // ...
  withSubmit
/>
```

---

TITLE: Accessing AutoForm State with onFormInit and values (TSX)
DESCRIPTION: Illustrates how to gain more granular control over the form state by using the `onFormInit` prop to access the react-hook-form instance and the `values` prop for controlled form management. It demonstrates watching form changes and accessing form state properties.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_3

LANGUAGE: tsx
CODE:

```
const [values, setValues] = useState({});

<AutoForm
  onFormInit={(form) => {
    // You can use the "form" prop to access the underlying "react-hook-form" instance
    // https://www.react-hook-form.com/api/useform/
    form.watch((data) => {
      setValues(data);
    });

    // You can freely save the form instance to a state or context and use it later to access the form state
    form.formState.isDirty; // => true
  }}
  values={values}
/>;
```

---

TITLE: Starting Local Development Server with PNPM
DESCRIPTION: This command initiates the local development server for the Nextra documentation site using PNPM. It typically compiles the site and serves it, often with hot-reloading, accessible at localhost:3000.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/README.md#_snippet_1

LANGUAGE: Shell
CODE:

```
pnpm dev
```

---

TITLE: Installing AutoForm React Package
DESCRIPTION: Installs the `@autoform/react` package using npm, making it available for use in a React project.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/react/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/react
```

---

TITLE: Using AutoForm in Next.js Client Components (TSX)
DESCRIPTION: Explains how to use AutoForm within a Next.js application by marking the component that renders AutoForm as a client component using the "use client" directive. This is necessary because AutoForm requires client-side execution.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
// MyPage.tsx
export default function MyPage() {
  return (
    <div>
      <MyForm />
    </div>
  );
}

// MyForm.tsx
"use client";
import { AutoForm } from "@autoform/mui";
export default function MyForm() {
  return <AutoForm ... />;
}
```

---

TITLE: Installing MUI integration for AutoForm
DESCRIPTION: This command installs the @autoform/mui package using npm, adding it as a dependency to your project.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/mui/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/mui
```

---

TITLE: Installing AutoForm and Custom UI Integration (Bash)
DESCRIPTION: Demonstrates how to install the core `@autoform/react` library and the newly created custom UI integration package (`@autoform/custom-ui`) using npm. This command adds the packages as dependencies to a project.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_6

LANGUAGE: bash
CODE:

```
npm install @autoform/react @autoform/custom-ui
```

---

TITLE: Install @autoform/core Package
DESCRIPTION: Installs the @autoform/core package using npm. This package provides the core functionality for AutoForm, independent of specific UI libraries or schema definitions.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/core/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/core
```

---

TITLE: Publishing AutoForm UI Integration Package (Bash)
DESCRIPTION: Publishes the built package to the npm registry, making it available for others to install and use. The `prepublishOnly` script ensures the build step is run automatically before publishing.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_5

LANGUAGE: bash
CODE:

```
npm publish
```

---

TITLE: Installing @autoform/yup package
DESCRIPTION: Installs the @autoform/yup package using npm. This package provides integration between Yup schemas and AutoForm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/yup/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/yup
```

---

TITLE: Passing Props to AutoForm Element with formProps (TSX)
DESCRIPTION: Explains how to pass standard HTML form attributes or event handlers to the underlying `<form>` element rendered by AutoForm using the `formProps` prop. This allows customization of the form element's behavior and appearance.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_4

LANGUAGE: tsx
CODE:

```
<AutoForm
  schema={schemaProvider}
  onSubmit={handleSubmit}
  formProps={{
    className: "my-custom-form-class",
    onKeyDown: (e) => {
      if (e.key === "Enter") e.preventDefault();
    },
  }}
/>
```

---

TITLE: Install @autoform/chakra package (npm)
DESCRIPTION: Installs the @autoform/chakra package using npm, adding Chakra UI integration capabilities to AutoForm projects. This command is typically run in the project's root directory.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/chakra/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/chakra
```

---

TITLE: Adding Child Elements Below AutoForm (TSX)
DESCRIPTION: Demonstrates that any React children passed directly to the AutoForm component will be rendered below the generated form fields and submit button, allowing for the inclusion of additional content like text or links.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/getting-started.mdx#_snippet_6

LANGUAGE: tsx
CODE:

```
<AutoForm>
  <p className="text-gray-500 text-sm">
    By submitting this form, you agree to our{" "}
    <a href="#" className="text-primary underline">
      terms and conditions
    </a>
    .
  </p>
</AutoForm>
```

---

TITLE: Install AutoForm Zod Integration Package (Bash)
DESCRIPTION: Installs the `@autoform/zod` package using npm, adding Zod schema integration capabilities to your AutoForm project. This is the first step to using Zod schemas with AutoForm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/zod/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/zod
```

---

TITLE: Installing Mantine integration for AutoForm (npm)
DESCRIPTION: Installs the Mantine integration package for AutoForm using npm. This package is required to use AutoForm with Mantine components.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/mantine/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/mantine
```

---

TITLE: Installing ANT Design Integration for AutoForm (npm)
DESCRIPTION: Installs the @autoform/ant package using npm, adding ANT Design integration capabilities to your AutoForm project. This package is a dependency for using ANT Design components with AutoForm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/packages/ant/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm install @autoform/ant
```

---

TITLE: Basic Yup Schema and AutoForm Usage (TSX)
DESCRIPTION: Demonstrates the fundamental setup for using Yup with AutoForm. It shows how to define a complex Yup schema with various field types (string, number, array, object, mixed/enum), apply validations, set labels and defaults, and use `fieldConfig` for custom properties. Includes the basic AutoForm rendering setup within a React component.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_0

LANGUAGE: tsx
CODE:

```
"use client";
import { YupProvider } from "@autoform/yup";
import { object, string, number, date, InferType, array, mixed } from "yup";
import { buildYupFieldConfig } from "@autoform/react";
import { AutoForm, FieldTypes } from "@autoform/mui"; // use any UI library

const fieldConfig = buildYupFieldConfig<
  FieldTypes,
  {
    // You can define custom props here
    isImportant?: boolean;
  }
>();

// Define your form schema using yup
const yupFormSchema = object({
  name: string().required().label("Your Name").default("John Doe"),

  age: number()
    .required(
      // You can use custom error messages
      "We need your age to verify you're old enough to use this form"
    )
    .positive()
    .integer(),

  email: string()
    .email()
    // You can use fieldConfig to set additional configuration for a field
    .transform(
      fieldConfig<React.ReactNode, FieldTypes>({
        inputProps: {
          type: "email",
        },
        customData: {
          // You can add custom data here
          isImportant: true,
        },
      })
    ),
  website: string().url().nullable(),

  // You can use arrays and sub-objects
  guests: array().of(
    object({
      name: string().required(),
    })
  ),
  hobbies: array().of(string()),

  // You can use enums
  sport: mixed().oneOf(Object.values(Sports)),
});

export const yupSchemaProvider = new YupProvider(yupFormSchema);

function App() {
  return (
    <AutoForm
      schema={yupSchemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Using Custom AutoForm UI Integration in React (TSX)
DESCRIPTION: Shows how to import and use the custom `AutoForm` component within a React application. It demonstrates setting up a schema provider (using `ZodProvider` as an example) and rendering the `AutoForm` component, passing the schema and an `onSubmit` handler.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_7

LANGUAGE: tsx
CODE:

```
import { AutoForm, fieldConfig } from "@autoform/custom-ui";
import { ZodProvider } from "@autoform/zod";

const mySchema = z.object({
  // ... your schema definition
});
const schemaProvider = new ZodProvider(mySchema);

function MyForm() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Building Custom Field Config Helper (TSX)
DESCRIPTION: Provides an example of creating a custom `fieldConfig` helper function using `buildYupFieldConfig` from `@autoform/react`. This function allows you to pass UI library-specific types (`FieldTypes`) and define custom properties that can be used to control how fields are rendered.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_6

LANGUAGE: tsx
CODE:

```
import { buildYupFieldConfig } from "@autoform/react";
import { FieldTypes } from "@autoform/mui";

export const fieldConfig = buildYupFieldConfig<
  FieldTypes, // You should provide the "FieldTypes" type from the UI library you use
  {
    isImportant?: boolean; // You can add custom props here
  }
>();
```

---

TITLE: Registering Custom Field Component in AutoForm (TSX)
DESCRIPTION: Shows how to integrate a newly created custom field component (`CustomField`) into the `formComponents` object within the `AutoForm.tsx` file. This mapping allows `AutoForm` to use the custom component when a field in the schema is configured with the corresponding key (`custom` in this example).

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_2

LANGUAGE: tsx
CODE:

```
// src/AutoForm.tsx
// ... other imports
import { CustomField } from "./components/CustomField";

const formComponents: CustomAutoFormFieldComponents = {
  // ... other fields
  custom: CustomField,
};
```

---

TITLE: Creating Select Fields with Zod enum and nativeEnum (TSX)
DESCRIPTION: Explains how AutoForm supports Zod's enum and nativeEnum types to automatically render select input fields. Shows examples for both standard enums and native TypeScript enums, including using backed enums for custom labels.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_5

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  color: z.enum(["red", "green", "blue"]),
});

enum BreadTypes {
  // For native enums, you can alternatively define a backed enum to set a custom label
  White = "White bread",
  Brown = "Brown bread",
  Wholegrain = "Wholegrain bread",
  Other,
}
// Keep in mind that zod will validate and return the enum labels, not the enum values!
const formSchema = z.object({
  bread: z.nativeEnum(BreadTypes),
});
```

---

TITLE: Setting Default Values for Array Fields in Joi Schema (TSX)
DESCRIPTION: This snippet extends the array example by showing how to set a default value for an array field using the `.default()` method. It emphasizes that the default array elements must match the structure defined in the `.items()` method.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_5

LANGUAGE: TSX
CODE:

```
// Add array default value example
const formSchema = Joi.object({
  invitedGuests: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number(),
      })
    )
    .default([
      { name: "John", age: 24 },
      { name: "Jane", age: 20 },
    ])
    .label("Guests invited to the party"),
});
```

---

TITLE: Setting Default Value for Array Field in Zod Schema (AutoForm) - TSX
DESCRIPTION: This example shows how to set a default value for an array field within a Zod schema using the `.default()` method. The default value must match the structure defined for the array elements. This is useful for pre-populating form fields.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_7

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  guestListName: z.string(),
  invitedGuests: z
    .array(
      // Define the fields for each item
      z.object({
        name: z.string(),
        age: z.coerce.number(),
      })
    )
    .describe("Guests invited to the party")
    .default([
      {
        name: "John",
        age: 24,
      },
      {
        name: "Jane",
        age: 20,
      },
    ]),
});
```

---

TITLE: Creating and Publishing AutoForm Releases
DESCRIPTION: These commands outline the release process for AutoForm using changesets. It includes building the project, running tests, creating a changeset entry, versioning the changes, and publishing the new versions to npm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/README.md#_snippet_3

LANGUAGE: bash
CODE:

```
npm run build
npm run cypress # Run the component tests
npx changeset
```

LANGUAGE: bash
CODE:

```
npx changeset version
npx changeset publish
```

---

TITLE: Configuring Package.json for AutoForm UI Integration (JSON)
DESCRIPTION: Provides a standard `package.json` configuration for publishing the custom AutoForm UI integration as an npm package. It defines package metadata, entry points (`main`, `types`), build scripts, peer dependencies (`react`, `@autoform/react`, `@autoform/core`), and development dependencies (`typescript`).

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_3

LANGUAGE: json
CODE:

```
{
  "name": "@autoform/custom-ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^17 || ^18 || ^19",
    "@autoform/react": "^1.0.0",
    "@autoform/core": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^4.5.0"
  }
}
```

---

TITLE: Building AutoForm UI Integration Package (Bash)
DESCRIPTION: Executes the build script defined in `package.json`, typically compiling TypeScript code into JavaScript and generating type definitions. This step is necessary before publishing the package.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_4

LANGUAGE: bash
CODE:

```
npm run build
```

---

TITLE: Accessing Form Instance with onFormInit (React/TypeScript)
DESCRIPTION: Use the 'onFormInit' prop to gain access to the underlying 'react-hook-form' instance when the form initializes. This allows manual control over form state, watching values, or saving the instance for later use.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/migration.mdx#_snippet_3

LANGUAGE: typescript
CODE:

```
const [values, setValues] = useState({});

<AutoForm
  onFormInit={(form) => {
    // You can use the "form" prop to access the underlying "react-hook-form" instance
    // https://www.react-hook-form.com/api/useform/
    form.watch((data) => {
      setValues(data);
    });

    // You can freely save the form instance to a state or context and use it later to access the form state
    form.formState.isDirty; // => true
  }}
  values={values}
/>;
```

---

TITLE: Rendering a Form with AutoForm (MUI)
DESCRIPTION: This React component `MyForm` renders a form using the `AutoForm` component from `@autoform/mui`. It takes a `schemaProvider` prop and defines an `onSubmit` handler to log the form data. The `withSubmit` prop adds a submit button.

SOURCE: https://github.com/vantezzen/autoform/blob/main/README.md#_snippet_1

LANGUAGE: tsx
CODE:

```
import { AutoForm } from "@autoform/mui";
import { ZodProvider } from "@autoform/zod";

function MyForm() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Implementing Zod Schema Provider in TypeScript
DESCRIPTION: This snippet shows the implementation of the `ZodProvider` class, which adapts Zod schemas for use with AutoForm. It implements the `SchemaProvider` interface, providing methods for parsing the schema, validating data using Zod's `parse` method, and extracting default values.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/technical/structure.mdx#_snippet_0

LANGUAGE: tsx
CODE:

```
// packages/zod/src/provider.ts
import { z } from "zod";
import { SchemaProvider, ParsedSchema } from "@autoform/core";
import { getDefaultValues } from "./default-values";
import { parseSchema } from "./schema-parser";

export class ZodProvider<T extends z.ZodObject<any, any>>
  implements SchemaProvider<z.infer<T>>
{
  constructor(private schema: T) {}

  parseSchema(): ParsedSchema {
    return parseSchema(this.schema);
  }

  validateSchema(values: z.infer<T>) {
    try {
      this.schema.parse(values);
      return { success: true, data: values } as const;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.errors } as const;
      }
      throw error;
    }
  }

  getDefaultValues(): Record<string, any> {
    return getDefaultValues(this.schema);
  }
}
```

---

TITLE: Defining AutoForm Schema with Joi (TSX)
DESCRIPTION: This snippet demonstrates the basic usage of AutoForm with a Joi schema. It shows how to define various field types (string, number, email, uri, date, array, object, enum) with validations, labels, default values, and custom field configurations using `buildJoiFieldConfig`. It also shows how to create a `JoiProvider` and render the form using the `AutoForm` component.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_0

LANGUAGE: TSX
CODE:

```
"use client";
import { JoiProvider } from "@autoform/joi";
import Joi from "joi";
import { buildJoiFieldConfig } from "@autoform/react";
import { AutoForm, FieldTypes } from "@autoform/mui"; // use any UI library

const fieldConfig = buildJoiFieldConfig<
  FieldTypes,
  {
    // You can define custom props here
    isImportant?: boolean;
  }
>();

// Define your form schema using Joi
const joiFormSchema = Joi.object({
  // Use the "label" method to set the label
  // You can set a default value
  name: Joi.string().required().label("Your Name").default("John Doe"),

  age: Joi.number().required().positive().integer().messages({
    "any.required":
      "We need your age to verify you're old enough to use this form",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    // You can add additional config for a field using fieldConfig
    .meta(
      fieldConfig({
        inputProps: {
          type: "email",
        },
        customData: {
          // You can add custom data here
          isImportant: true,
        },
      })
    ),

  website: Joi.string().uri().allow(null),

  // Date will show a date picker
  birthday: Joi.date().optional(),

  // You can use arrays and sub-objects
  guests: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
    })
  ),
  hobbies: Joi.array().items(Joi.string()),

  // You can use enums, will show a select field
  color: Joi.any().valid("red", "green", "blue"),
});

export const joiSchemaProvider = new JoiProvider(joiFormSchema);

function App() {
  return (
    <AutoForm
      schema={joiSchemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Basic Zod Schema and AutoForm Usage (TSX)
DESCRIPTION: Demonstrates defining a complex Zod schema with various field types (string, number, boolean, date, enum, object), validations, descriptions, coercion, optional fields, and default values. Shows how to use ZodProvider and render the form with AutoForm.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_0

LANGUAGE: tsx
CODE:

```
"use client";
import * as z from "zod";
import { ZodProvider } from "@autoform/zod";
import { buildZodFieldConfig } from "@autoform/react";
import { AutoForm, FieldTypes } from "@autoform/mui"; // use any UI library

const fieldConfig = buildZodFieldConfig<
  FieldTypes,
  {
    // You can define custom props here
    isImportant?: boolean;
  }
>();

// Define your form schema using zod
const formSchema = z.object({
  username: z
    .string({
      required_error: "Username is required.",
    })
    // You can use zod's built-in validation as normal
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),

  password: z
    .string({
      required_error: "Password is required.",
    })
    // Use the "describe" method to set the label
    // If no label is set, the field name will be used
    // and un-camel-cased
    .describe("Your secure password")
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    // You can add additional config for how to render this field
    // using fieldConfig
    .superRefine(
      fieldConfig<React.ReactNode, FieldTypes>({
        description: "We recommend to use a strong password.",
        inputProps: {
          type: "password",
        },
        customData: {
          // You can add custom data here
          isImportant: true,
        },
      })
    ),

  favouriteNumber: z.coerce // When using numbers and dates, you must use coerce
    .number({
      invalid_type_error: "Favourite number must be a number.",
    })
    .min(1,{
      message: "Favourite number must be at least 1.",
    })
    .max(10, {
      message: "Favourite number must be at most 10.",
    })
    .default(5) // You can set a default value
    .optional(),

  acceptTerms: z
    .boolean()
    .describe("Accept terms and conditions.")
    .refine((value) => value, {
      message: "You must accept the terms and conditions.",
      path: ["acceptTerms"],
    }),

  // Date will show a date picker
  birthday: z.coerce.date().optional(),

  // Enum will show a select
  color: z.enum(["red", "green", "blue"]),

  // You can use sub-objects that will be rendered with their own title
  guestDetails: z.object({
    name: z.string(),
    age: z.coerce.number(),
  }),
});

const schemaProvider = new ZodProvider(formSchema);

function App() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Defining FieldConfig Inline with Zod (TypeScript/Zod)
DESCRIPTION: Define field configuration directly within the Zod schema using the 'superRefine' method and the 'buildZodFieldConfig' helper from '@autoform/react'. This allows specifying descriptions, input props, and other config inline.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/migration.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
import * as z from "zod";
import { buildZodFieldConfig } from "@autoform/react";
import { FieldTypes } from "@/components/ui/autoform";

const fieldConfig = buildZodFieldConfig();

const formSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Please use a secure password.",
    })
    .superRefine(
      fieldConfig<React.ReactNode, FieldTypes>({
        description: "We recommend to use a strong password.",
        inputProps: {
          type: "password",
        },
      })
    )
});
```

---

TITLE: Creating MUI AutoForm Component in React/TSX
DESCRIPTION: This snippet demonstrates how a UI-specific library like `@autoform/mui` wraps the core `@autoform/react` `BaseAutoForm` component. It defines MUI-specific UI and field components and passes them to the base component, optionally applying a Material UI theme.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/technical/structure.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
// packages/mui/src/AutoForm.tsx
import React from "react";
import {
  AutoForm as BaseAutoForm,
  AutoFormUIComponents,
  AutoFormFieldComponents,
} from "@autoform/react";
import { ThemeProvider } from "@mui/material/styles";
import { AutoFormProps } from "./types";
import { Form } from "./components/Form";
import { FieldWrapper } from "./components/FieldWrapper";
import { ErrorMessage } from "./components/ErrorMessage";
import { SubmitButton } from "./components/SubmitButton";
import { StringField } from "./components/StringField";
import { NumberField } from "./components/NumberField";
import { BooleanField } from "./components/BooleanField";
import { DateField } from "./components/DateField";
import { SelectField } from "./components/SelectField";
import { ArrayField } from "./components/ArrayField";

const MuiUIComponents: AutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
};

export const MuiAutoFormFieldComponents: AutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
  array: ArrayField,
};

export function AutoForm<T extends Record<string, any>>({
  theme,
  ...props
}: AutoFormProps<T>) {
  const ThemedForm = () => (
    <BaseAutoForm
      {...props}
      uiComponents={MuiUIComponents}
      formComponents={MuiAutoFormFieldComponents}
    />
  );

  return theme ? (
    <ThemeProvider theme={theme}>
      <ThemedForm />
    </ThemeProvider>
  ) : (
    <ThemedForm />
  );
}
```

---

TITLE: Updating AutoForm Component Usage (React/TypeScript)
DESCRIPTION: Update imports to use the new 'autoform' folder, wrap the schema in a ZodProvider, and use the 'schema' prop instead of 'formSchema'. The submit button can now be added via the 'withSubmit' prop.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/migration.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import { AutoForm } from "@/components/ui/autoform";
import { ZodProvider } from "@autoform/zod";

const mySchema = z.object({
  // ...
});

const schemaProvider = new ZodProvider(mySchema);

function MyForm() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    >
    </AutoForm>
  );
}
```

---

TITLE: Rendering a Form with AutoForm (TSX)
DESCRIPTION: This snippet demonstrates how to use the AutoForm component within a React application. It imports AutoForm and a schema provider (like ZodProvider), passes a schema to the component, defines an onSubmit handler, and includes a submit button.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/index.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
import { AutoForm } from "@autoform/mui";
import { ZodProvider } from "@autoform/zod";

function MyForm() {
  return (
    <AutoForm
      schema={schemaProvider}
      onSubmit={(data) => {
        console.log(data);
      }}
      withSubmit
    />
  );
}
```

---

TITLE: Defining Select/Enum Fields in Joi Schema for AutoForm (TSX)
DESCRIPTION: This snippet demonstrates how to create a select or enum field in AutoForm by using Joi's `.any().valid()` method. It shows how to use an enum and spread its values into the `valid` method.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_3

LANGUAGE: TSX
CODE:

```
enum BreadTypes {
  White = "White bread",
  Brown = "Brown bread",
  Wholegrain = "Wholegrain bread",
  Other = "Other",
}

const formSchema = Joi.object({
  breadType: Joi.any().valid(...Object.values(BreadTypes)),
});
```

---

TITLE: Creating Custom AutoForm Wrapper Component (TSX)
DESCRIPTION: Defines a wrapper component `AutoForm` that extends `@autoform/react`'s `BaseAutoForm`. It injects custom UI and form field components defined locally, allowing users to provide their own React components for rendering the form elements based on schema types.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_0

LANGUAGE: tsx
CODE:

```
// src/AutoForm.tsx
import { AutoForm as BaseAutoForm } from "@autoform/react";
import {
  CustomAutoFormUIComponents,
  CustomAutoFormFieldComponents,
} from "./types";
import { Form, FieldWrapper, ErrorMessage, SubmitButton } from "./components";
import { StringField, NumberField, DateField } from "./components";

const uiComponents: CustomAutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
};

const formComponents: CustomAutoFormFieldComponents = {
  // The key should match the data type (string, number, date, etc.) or a custom field type (e.g. radio)
  string: StringField,
  number: NumberField,
  date: DateField,
};

export function AutoForm<T extends Record<string, any>>(
  props: Omit<
    Parameters<typeof BaseAutoForm>[0],
    "uiComponents" | "formComponents"
  >
) {
  return (
    <BaseAutoForm
      {...props}
      uiComponents={uiComponents}
      formComponents={formComponents}
    />
  );
}
```

---

TITLE: Setting Field Labels with Zod describe (TSX)
DESCRIPTION: Shows how to use the z.describe() method to explicitly set the label for a form field. Explains that the field name is used and un-camel-cased if no description is provided.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_1

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  username: z.string().describe("Your username"),
  someValue: z.string(), // Will be "Some Value"
});
```

---

TITLE: Initializing Zod Field Config and Schema
DESCRIPTION: Demonstrates how to initialize `buildZodFieldConfig` with custom types and apply a `fieldConfig` to a Zod string field using `superRefine`, including setting label, inputProps, and customData.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_0

LANGUAGE: tsx
CODE:

```
import * as z from "zod";
import { buildZodFieldConfig } from "@autoform/react";
import { FieldTypes } from "@autoform/mui";

const fieldConfig = buildZodFieldConfig<
  FieldTypes, // You should provide the "FieldTypes" type from the UI library you use
  {
    isImportant?: boolean; // You can add custom props here
  }
>();

const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      label: "Username",
      inputProps: {
        placeholder: "Enter your username",
      },
      customData: {
        isImportant: true, // You can add custom data here
      },
    })
  ),
  // ...
});
```

---

TITLE: Customizing Components with formComponents and fieldWrapper (React/TypeScript)
DESCRIPTION: Customize individual field wrappers using the 'fieldWrapper' option in 'fieldConfig' or provide custom components for specific field types using the 'formComponents' prop on the AutoForm component.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/migration.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      fieldWrapper: (props) => (
        <div>
          <label>{props.label}</label>
          {props.children}
        </div>
      ),
    })
  ),
});

<AutoForm
  schema={schema}
  formComponents={{
    custom: ({ field, label, inputProps }) => {
      return (
        <div>
          <input
            type="text"
            className="bg-red-400 rounded-lg p-4"
            {...inputProps}
          />
        </div>
      );
    },
  }}
/>;
```

---

TITLE: Defining Custom AutoForm Component
DESCRIPTION: Shows how to define a custom input component and pass it to the `AutoForm` component using the `formComponents` prop, demonstrating how to receive and apply `field`, `label`, and `inputProps`.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_3

LANGUAGE: tsx
CODE:

```
<AutoForm
  formComponents={{
    custom: ({ field, label, inputProps }: AutoFormFieldProps) => {
      return (
        <div>
          <input
            type="text"
            className="bg-red-400 rounded-lg p-4"
            // You should always pass the "inputProps" to the input component
            // This includes the handlers for "onChange", "onBlur", etc.
            {...inputProps}
          />
        </div>
      );
    },
  }}
/>;
```

---

TITLE: Building Custom Field Configuration Function for Joi (TSX)
DESCRIPTION: This snippet shows how to create a custom `fieldConfig` function using `buildJoiFieldConfig` from `@autoform/react`. This function allows adding UI-library-specific props (`inputProps`) and custom data (`customData`) to individual fields within the Joi schema using the `.meta()` method. It requires providing the `FieldTypes` from the specific UI library being used.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_7

LANGUAGE: TSX
CODE:

```
import { buildJoiFieldConfig } from "@autoform/react";
import { FieldTypes } from "@autoform/mui";

const fieldConfig = buildJoiFieldConfig<
  FieldTypes, // You should provide the "FieldTypes" type from the UI library you use
  {
    isImportant?: boolean; // You can add custom props here
  }
>();
```

---

TITLE: Creating Custom Field Configuration Function (AutoForm) - TSX
DESCRIPTION: This code demonstrates how to create a custom `fieldConfig` function using `buildZodFieldConfig` from `@autoform/react`. This function allows defining additional configuration for how fields are rendered, independent of the UI library. It shows how to type the function with supported `FieldTypes` and custom properties.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_9

LANGUAGE: tsx
CODE:

```
import { buildZodFieldConfig } from "@autoform/react";
import { FieldTypes } from "@autoform/mui";

const fieldConfig = buildZodFieldConfig<
  FieldTypes,
  {
    isImportant?: boolean;
  }
>();
```

---

TITLE: Adding Description to Field with Zod Field Config
DESCRIPTION: Explains how to use the `description` property within `fieldConfig` to add explanatory text that will be displayed below the input field in the rendered form.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_5

LANGUAGE: tsx
CODE:

```
const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      description:
        "Enter a unique username. This will be shown to other users.",
    })
  ),
});
```

---

TITLE: Defining a Custom AutoForm Field Component (TSX)
DESCRIPTION: Creates a simple React functional component `CustomField` that implements the `AutoFormFieldProps` interface from `@autoform/react`. This component demonstrates how to build a custom input field for `AutoForm`, handling value changes and receiving field metadata and error state.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/custom-integration.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
// src/components/CustomField.tsx
import React from "react";
import { AutoFormFieldProps } from "@autoform/react";

export const CustomField: React.FC<AutoFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  id,
}) => (
  <div>
    <input
      id={id}
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
    <button onClick={() => onChange(value + "!")}>Add !</button>
  </div>
);
```

---

TITLE: Setting Default Field Values in Joi Schema for AutoForm (TSX)
DESCRIPTION: This snippet shows how to use the `.default()` method in Joi to provide a default value for a form field. It notes that for Date fields, the default value should be converted to a `Date` object.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_2

LANGUAGE: TSX
CODE:

```
const formSchema = Joi.object({
  favouriteNumber: Joi.number().default(5),
});
```

---

TITLE: Setting Field Labels in Joi Schema for AutoForm (TSX)
DESCRIPTION: This snippet illustrates how to use the `.label()` method in Joi to explicitly set the label for a form field in AutoForm. If no label is provided, AutoForm infers it from the field name by un-camel-casing it.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_1

LANGUAGE: TSX
CODE:

```
const formSchema = Joi.object({
  username: Joi.string().label("Your username"),
  someValue: Joi.string(), // Will be "Some Value"
});
```

---

TITLE: Setting Field Labels with Yup (TSX)
DESCRIPTION: Illustrates how to use the `.label()` method on a Yup schema field to provide a human-readable label that AutoForm will use when rendering the form field. It also shows the default behavior where the field name is used and un-camel-cased if no label is explicitly set.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_1

LANGUAGE: tsx
CODE:

```
const formSchema = object({
  username: string().label("Your username"),
  someValue: string(), // Will be "Some Value"
});
```

---

TITLE: Using Zod coerce for Number and Date Fields (TSX)
DESCRIPTION: Explains the necessity of using z.coerce for number and date fields when integrating with AutoForm, as input elements return strings that need type conversion.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_2

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  favouriteNumber: z.coerce.number(),
  birthday: z.coerce.date(),
});
```

---

TITLE: Setting Default Field Values with Zod default (TSX)
DESCRIPTION: Shows how to set a default value for a field in the Zod schema using the z.default() method. Notes how to handle default dates.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_4

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  favouriteNumber: z.number().default(5),
});
```

---

TITLE: Defining a Zod Schema for User Data
DESCRIPTION: This snippet defines a Zod object schema named `userSchema` with fields for name (string), birthday (coerced to date), and email (string with email format validation). This schema can be used by AutoForm to automatically generate a form.

SOURCE: https://github.com/vantezzen/autoform/blob/main/README.md#_snippet_0

LANGUAGE: ts
CODE:

```
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  birthday: z.coerce.date(),
  email: z.string().email(),
});
```

---

TITLE: Making Fields Optional with Zod optional (TSX)
DESCRIPTION: Demonstrates how to make a field optional in the form schema by chaining the z.optional() method to the Zod type definition.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_3

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  username: z.string().optional(),
});
```

---

TITLE: Creating Select/Enum Fields with Yup (TSX)
DESCRIPTION: Explains how to define a select field in the Yup schema using `mixed().oneOf`. This method is typically used with `Object.values` of an enum to provide a predefined list of options for the user to select from.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_3

LANGUAGE: tsx
CODE:

```
enum BreadTypes {
  // For native enums, you can alternatively define a backed enum to set a custom label
  White = "White bread",
  Brown = "Brown bread",
  Wholegrain = "Wholegrain bread",
  Other,
}
const formSchema = object({
  breadType: mixed().oneOf(Object.values(BreadTypes)),
});
```

---

TITLE: Setting Default Field Values with Yup (TSX)
DESCRIPTION: Demonstrates using the `.default()` method on a Yup schema field to pre-populate the form with a specific value when it is initially rendered. Note that for date values, you should convert them to a `Date` object first.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_2

LANGUAGE: tsx
CODE:

```
const formSchema = object({
  favouriteNumber: number().default(5),
});
```

---

TITLE: Defining a Zod Schema
DESCRIPTION: This snippet defines a sample Zod schema for a user object, including fields for name (string), birthday (coerced to a date), and email (string with email format validation). This schema can then be used by AutoForm to generate a corresponding form.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  birthday: z.coerce.date(),
  email: z.string().email(),
});
```

---

TITLE: Defining Array Fields in Joi Schema for AutoForm (TSX)
DESCRIPTION: This snippet shows how to define an array field in a Joi schema for use with AutoForm. It demonstrates defining an array of objects with nested fields and also a simple array of strings. It mentions that arrays are not supported as the root schema element.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_4

LANGUAGE: TSX
CODE:

```
const formSchema = Joi.object({
  invitedGuests: Joi.array()
    .items(
      // Define the fields for each item
      Joi.object({
        name: Joi.string(),
        age: Joi.number(),
      })
    )
    // Optionally set a custom label - otherwise this will be inferred from the field name
    .label("Guests invited to the party"),
  hobbies: Joi.array().items(Joi.string()),
});
```

---

TITLE: Passing Input Props with Zod Field Config
DESCRIPTION: Shows how to use the `inputProps` property within `fieldConfig` applied via Zod's `superRefine` to pass standard HTML input attributes like `type` and `placeholder` to the underlying input component.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_1

LANGUAGE: tsx
CODE:

```
const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      inputProps: {
        type: "text",
        placeholder: "Username",
      },
    })
  ),
});
// This will be rendered as:
<input type="text" placeholder="Username" /* ... */ />;
```

---

TITLE: Customizing Field Wrapper in AutoForm (TSX)
DESCRIPTION: Demonstrates how to use the `fieldWrapper` property within `fieldConfig` to wrap a field with a custom component. This requires manually handling the rendering of the field label and error within the custom wrapper.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_7

LANGUAGE: tsx
CODE:

```
const schema = z.object({
  email: z.string().superRefine(
    fieldConfig({
      fieldWrapper: (props: FieldWrapperProps) => {
        return (
          <>
            {props.children}
            <p className="text-muted-foreground text-sm">
              Don't worry, we won't share your email with anyone!
            </p>
          </>
        );
      },
    })
  ),
});
```

---

TITLE: Controlling Field Order with Zod Field Config
DESCRIPTION: Shows how to use the `order` property in `fieldConfig` to specify the display order of fields in the form, where smaller numbers appear first and fields without an explicit order default to 0.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_6

LANGUAGE: tsx
CODE:

```
const schema = z.object({
  termsOfService: z.boolean().superRefine(
    fieldConfig({
      order: 1, // This will be displayed after other fields with order 0
    })
  ),

  username: z.string().superRefine(
    fieldConfig({
      order: -1, // This will be displayed first
    })
  ),

  email: z.string().superRefine(
    fieldConfig({
      // Without specifying an order, this will have order 0
    })
  ),
});
```

---

TITLE: Customizing AutoForm Element Properties (TSX)
DESCRIPTION: Illustrates how to customize the main form element itself by passing properties like `className`, `data-testid`, `noValidate`, and event handlers via the `formProps` prop of the `AutoForm` component.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_9

LANGUAGE: tsx
CODE:

```
<AutoForm
  schema={schemaProvider}
  onSubmit={handleSubmit}
  formProps={{
    className: "my-custom-form",
    "data-testid": "user-form",
    noValidate: true,
    onTouchStart: (e) => {
      console.log("onTouchStart", e);
    }
  }}
/>
```

---

TITLE: Defining Array Fields in Zod Schema (AutoForm) - TSX
DESCRIPTION: This snippet demonstrates how to define array fields within a Zod object schema for use with AutoForm. It shows an array of complex objects (`invitedGuests`) and an array of simple strings (`hobbies`). The `describe` method is used to provide a custom label for the array field.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_6

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  invitedGuests: z
    .array(
      // Define the fields for each item
      z.object({
        name: z.string(),
        age: z.coerce.number(),
      })
    )
    // Optionally set a custom label - otherwise this will be inferred from the field name
    .describe("Guests invited to the party"),
  hobbies: z.array(z.string()),
});
```

---

TITLE: Defining Sub-object Fields with Yup (TSX)
DESCRIPTION: Demonstrates how to define nested object structures within the main Yup schema using the `object()` method. AutoForm will render these sub-objects as grouped fields, often with their own title, helping to organize complex forms.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_5

LANGUAGE: tsx
CODE:

```
const formSchema = object({
  guestDetails: object({
    name: string(),
    age: number(),
  }),
});
```

---

TITLE: Overriding AutoForm UI Components (TSX)
DESCRIPTION: Shows how to override default UI components, such as the `FieldWrapper`, using the `uiComponents` prop of the `AutoForm` component to customize the form's look and feel.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_8

LANGUAGE: tsx
CODE:

```
<AutoForm
  uiComponents={{
    FieldWrapper: ({ children, label, error }) => {
      return (
        <div>
          <label>{label}</label>
          {children}
          {error}
        </div>
      );
    }
  }}
/>
```

---

TITLE: Defining Array Fields with Yup (TSX)
DESCRIPTION: Illustrates how to define an array field within the Yup schema using the `array()` method. This allows AutoForm to handle lists of items, which can be primitive types or nested objects. You can optionally set a custom label for the array field.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/yup.md#_snippet_4

LANGUAGE: tsx
CODE:

```
const formSchema = object({
  invitedGuests: array(
    // Define the fields for each item
    object({
      name: string(),
      age: number(),
    })
  )
    // Optionally set a custom label - otherwise this will be inferred from the field name
    .label("Guests invited to the party"),
  hobbies: array(string()),
});
```

---

TITLE: Using Custom Field Type in Zod Schema
DESCRIPTION: Demonstrates how to extend the `FieldTypes` type to include a custom type ("custom") and then apply this custom `fieldType` to a Zod schema field using `fieldConfig` and `superRefine`.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_4

LANGUAGE: tsx
CODE:

```
const fieldConfig = buildZodFieldConfig<
  FieldTypes | "custom",
  {
    isImportant?: boolean;
  }
>();

const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      fieldType: "custom",
    })
  ),
});
```

---

TITLE: Defining Sub-Object Fields in Joi Schema for AutoForm (TSX)
DESCRIPTION: This snippet illustrates how to define nested objects (sub-objects) within a Joi schema. AutoForm will render these as grouped fields, often with their own title.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/joi.md#_snippet_6

LANGUAGE: TSX
CODE:

```
const formSchema = Joi.object({
  guestDetails: Joi.object({
    name: Joi.string(),
    age: Joi.number(),
  }),
});
```

---

TITLE: Overriding Field Type with Zod Field Config
DESCRIPTION: Illustrates how to explicitly set the component type for a field using the `fieldType` property in `fieldConfig`, overriding AutoForm's default component selection based on the Zod type.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/react/customization.md#_snippet_2

LANGUAGE: tsx
CODE:

```
const schema = z.object({
  username: z.string().superRefine(
    fieldConfig({
      fieldType: "textarea",
    })
  ),
});
```

---

TITLE: Defining Sub-Object Fields in Zod Schema (AutoForm) - TSX
DESCRIPTION: This snippet illustrates how to define nested objects (sub-objects) within a Zod schema. Sub-objects are used to group related fields and are typically rendered with their own title in the form UI.

SOURCE: https://github.com/vantezzen/autoform/blob/main/apps/docs/pages/docs/schema/zod.md#_snippet_8

LANGUAGE: tsx
CODE:

```
const formSchema = z.object({
  guestDetails: z.object({
    name: z.string(),
    age: z.coerce.number(),
  }),
});
```
