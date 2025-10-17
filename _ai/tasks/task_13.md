# Task 13: URL-based JSON Encoding for Workflow Sharing

**Goal:** Implement a mechanism to encode FlowJSON data into a URL-friendly format to enable portable sharing of workflows.

## 1. Brainstorming Technical Approaches

### Requirements:

*   The encoded data must be safe to include in a URL.
*   The final URL should not exceed the common browser limit of ~2048 characters.
*   The solution should be implemented as a utility function within the project.

### Approaches Considered:

1.  **Base64 Encoding:**
    *   **Pros:** Simple to implement, widely supported.
    *   **Cons:** Increases the size of the data by approximately 33%.
    *   **Length Calculation:** `encoded_length = 4 * (json_length / 3)`
    *   **Estimated Max JSON Size (pre-encoding):** `(2048 * 3) / 4` = ~1536 bytes. This is a rough estimate and doesn't account for the base URL part.

2.  **`encodeURIComponent`:**
    *   **Pros:** The standard and safest way to encode strings for URLs.
    *   **Cons:** Can be very inefficient for JSON, as characters like `{`, `}`, `"`, `:` will be escaped, significantly increasing the length.
    *   **Length Calculation:** Highly dependent on the JSON content. A JSON with many special characters will have a much larger encoded size.
    *   **Estimated Max JSON Size:** Hard to estimate, but likely much smaller than Base64 for typical JSON.

3.  **Compression + Encoding:**
    *   **Pros:** Offers the best compression ratio, allowing for larger JSON objects to be encoded within the URL limit.
    *   **Cons:** Requires a compression library (like `pako` for zlib compression in JS).
    *   **Process:**
        1.  `JSON.stringify()` the workflow object.
        2.  Compress the resulting string using a library like `pako`.
        3.  Encode the compressed binary data into a URL-safe format, like Base64url.
    *   **Length Calculation:** Depends on the compressibility of the JSON. A repetitive JSON structure will compress well.
    *   **Estimated Max JSON Size:** Could be significantly larger than other methods, potentially 4-10KB or more, depending on the compression ratio.

## 2. Proposed Plan

The **Compression + Encoding** approach is the most suitable as it will allow for the most complex workflows to be shared.

### Implementation Steps:

1.  **Add `pako` dependency:** Add `pako` and its types (`@types/pako`) to the `web` package, as this functionality will likely be used in the web-based playground.
2.  **Create a URL encoding utility:**
    *   Create a new file `packages/web/src/lib/url.ts`.
    *   Implement two functions:
        *   `encodeJsonForUrl(json: object): string`: This function will stringify, compress (with `pako.deflate`), and Base64url-encode the JSON object.
        *   `decodeJsonFromUrl(encoded: string): object`: This function will decode the Base64url string, decompress it, and parse it back into a JSON object.
3.  **Add Tests:**
    *   Create a test file `packages/web/src/lib/url.test.ts`.
    *   Add tests to ensure the encoding and decoding functions work correctly with various JSON objects.
    *   Test edge cases like empty objects or invalid input.
4.  **Integrate into Web App:**
    *   **Share Button:** Update the `Header` component (`packages/web/src/app/components/layout/Header.tsx`) to include a "Share" button. When clicked, this button will:
        *   Generate a shareable URL with the encoded workflow data using the `flow_v1` URL parameter.
        *   Update the browser's URL using `window.history.pushState`.
        *   Copy the generated URL to the clipboard.
    *   **URL Loading Component:** Create a new component `UrlFlowLoader` (`packages/web/src/app/components/logic/UrlFlowLoader.tsx`) to handle loading workflows from the URL. This component will:
        *   Check for the `flow_v1` URL parameter on component mount.
        *   Decode the workflow data if present.
        *   Load the decoded workflow into the application's state.
    *   **App Integration:** Integrate `UrlFlowLoader` into `App.tsx` (`packages/web/src/App.tsx`).