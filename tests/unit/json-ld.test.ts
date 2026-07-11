import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../../app/lib/json-ld";

test("serializeJsonLd escapes less-than signs in script-breaking strings", () => {
  const serialized = serializeJsonLd({
    value: "</script><script>alert(1)</script>",
  });

  assert.equal(
    serialized,
    '{"value":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}',
  );
  assert.equal(serialized.includes("<"), false);
});
