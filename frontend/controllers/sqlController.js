/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend Controller: SqlController (C in MVC)
 */
import { apiFetch as fetch } from "./api";

class SqlController {
  static async executeQuery(query) {
    try {
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        return await res.json();
      }
      return {
        success: false,
        error: "Failed to execute query on backend server"
      };
    } catch {
      const q = query.toLowerCase();
      return {
        success: true,
        engine: "MySQL 8.0.35 (InnoDB Local Mock)",
        executionTime: "12.4 ms",
        rowCount: q.includes("projects") ? 6 : q.includes("certificates") ? 14 : 2,
        columns: q.includes("projects") ? ["id", "title", "layer", "status"] : ["id", "title", "category", "issuer"],
        rows: q.includes("projects") ? [
          { id: 1, title: "Apple.com Official Web Experience Clone", layer: "Frontend", status: "Published" },
          { id: 2, title: "ChatGPT Full-Stack Clone", layer: "Frontend + Backend", status: "Published" },
          { id: 3, title: "Netflix Streaming Clone", layer: "Frontend", status: "Published" }
        ] : [
          { id: 1, title: "AWS Certified Solutions Architect", category: "1. Technology", issuer: "AWS" },
          { id: 6, title: "Higher Diploma in Technical Instruction", category: "2. Education", issuer: "Ministry of Education" }
        ]
      };
    }
  }
}
export {
  SqlController
};
