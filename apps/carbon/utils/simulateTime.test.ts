import { getRemainingCooldown } from "./simulateTime";
import { describe, it, expect, vi } from "vitest";

describe("getRemainingCooldown", () => {
  it("should return cooldownDuration if no lifetime", () => {
    const globalTime = 10;
    const cooldownDuration = 5;
    const lifetime: number[] = [];

    const result = getRemainingCooldown(lifetime, cooldownDuration, globalTime);
    expect(result).toBe(cooldownDuration);
  });

  it("should return remaining cooldown when total lifetime is less than globalTime", () => {
    const globalTime = 13;
    const cooldownDuration = 5;
    const lifetime = [5, 5]; // total lifetime: 5 + 5 = 10
    const nextCooldownEnd = 5 + 5 + cooldownDuration; // 5 + 5 + 5 = 15

    const result = getRemainingCooldown(lifetime, cooldownDuration, globalTime);
    expect(result).toBe(nextCooldownEnd - globalTime); // nextCooldownEnd (15) - globalTime (13) = 2
  });

  it("should return cooldownDuration if remainingDuration is 0", () => {
    const globalTime = 8;
    const cooldownDuration = 5;
    const lifetime = [4, 4]; // totalLifetime = 8

    const result = getRemainingCooldown(lifetime, cooldownDuration, globalTime);
    expect(result).toBe(cooldownDuration); // globalTime (8) - totalLifetime (8) = 0 (falsy)
  });

  it("should log an error and return cooldownDuration if totalLifetime is greater than globalTime", () => {
    const globalTime = 10;
    const cooldownDuration = 5;
    const lifetime = [6, 5]; // totalLifetime = 11 > globalTime = 10

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
    const result = getRemainingCooldown(lifetime, cooldownDuration, globalTime);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Total lifetime is greater than global time",
      { totalLifetime: 11, globalTime }
    );
    expect(result).toBe(cooldownDuration);
    consoleErrorSpy.mockRestore();
  });
});


