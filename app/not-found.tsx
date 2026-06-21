import { ErrorState } from "./ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="The page you are looking for is not what it seems."
      message="You followed the lights, but the hallway bent somewhere strange."
      detail="Try the lodge door again, or wander back to a place that still remembers your name."
    />
  );
}
