import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { Logger } from "./Logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("debug", () => {
    it("calls console.log", () => {
      const logger = new Logger({ timestamp: false });
      logger.debug("hello");

      expect(console.log).toHaveBeenCalledWith("[DEBUG]", "hello");
    });
  });

  describe("info", () => {
    it("calls console.info", () => {
      const logger = new Logger({ timestamp: false });
      logger.info("hello");

      expect(console.info).toHaveBeenCalledWith("[INFO]", "hello");
    });
  });

  describe("warn", () => {
    it("calls console.warn", () => {
      const logger = new Logger({ timestamp: false });
      logger.warn("hello");

      expect(console.warn).toHaveBeenCalledWith("[WARN]", "hello");
    });
  });

  describe("error", () => {
    it("calls console.error", () => {
      const logger = new Logger({ timestamp: false });
      logger.error("hello");

      expect(console.error).toHaveBeenCalledWith("[ERROR]", "hello");
    });
  });

  describe("log level filtering", () => {
    it("suppresses levels below the configured minimum", () => {
      const logger = new Logger({ level: "warn", timestamp: false });

      logger.debug("d");
      logger.info("i");
      logger.warn("w");
      logger.error("e");

      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith("[WARN]", "w");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "e");
    });

    it("outputs all levels when set to debug", () => {
      const logger = new Logger({ level: "debug", timestamp: false });

      logger.debug("d");
      logger.info("i");
      logger.warn("w");
      logger.error("e");

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it("only outputs error when level is error", () => {
      const logger = new Logger({ level: "error", timestamp: false });

      logger.debug("d");
      logger.info("i");
      logger.warn("w");
      logger.error("e");

      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("timestamp", () => {
    it("includes a timestamp by default", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00.000Z"));

      const logger = new Logger();
      logger.info("test");

      expect(console.info).toHaveBeenCalledWith(
        "[2025-01-15T12:00:00.000Z] [INFO]",
        "test"
      );

      vi.useRealTimers();
    });

    it("omits timestamp when disabled", () => {
      const logger = new Logger({ timestamp: false });
      logger.info("test");

      expect(console.info).toHaveBeenCalledWith("[INFO]", "test");
    });
  });

  describe("prefix", () => {
    it("includes the prefix when configured", () => {
      const logger = new Logger({ prefix: "MyModule", timestamp: false });
      logger.info("test");

      expect(console.info).toHaveBeenCalledWith("[INFO] [MyModule]", "test");
    });

    it("includes both timestamp and prefix", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00.000Z"));

      const logger = new Logger({ prefix: "App" });
      logger.warn("oops");

      expect(console.warn).toHaveBeenCalledWith(
        "[2025-01-15T12:00:00.000Z] [WARN] [App]",
        "oops"
      );

      vi.useRealTimers();
    });
  });

  describe("multiple arguments", () => {
    it("passes all arguments through", () => {
      const logger = new Logger({ timestamp: false });
      logger.info("a", 1, { key: "val" });

      expect(console.info).toHaveBeenCalledWith("[INFO]", "a", 1, {
        key: "val",
      });
    });
  });

  describe("defaults", () => {
    it("defaults to debug level with timestamp enabled", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-01T00:00:00.000Z"));

      const logger = new Logger();
      logger.debug("d");

      expect(console.log).toHaveBeenCalledWith(
        "[2025-06-01T00:00:00.000Z] [DEBUG]",
        "d"
      );

      vi.useRealTimers();
    });
  });
});
