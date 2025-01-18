const path = require("path");
const fs = require("fs");

/**
 * Reads the schema file and extracts both model definitions and enum definitions.
 * @param {string} schemaPath - Path to the Prisma schema file
 * @returns {{ models: Record<string, string[]>, enums: Record<string, string[]> }}
 */
const parsePrismaSchema = (schemaPath) => {
  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Remove all lines containing @@index
  const sanitizedSchema = schema.split("\n").filter((line) => !line.includes("@@index")).join("\n");

  // Regex for capturing Model definitions
  const modelRegex = /model\s+(\w+)\s+{([^}]+)}/g;

  // Regex for capturing Enum definitions
  const enumRegex = /enum\s+(\w+)\s+{([^}]+)}/g;

  // Type map from Prisma type -> TS type
  const typeMap = {
    Int: "number",
    String: "string",
    DateTime: "string",
    Float: "number",
    Decimal: "number",
    Boolean: "boolean",
    Json: "Record<string, any>",
    "Int?": "number",
    "String?": "string",
    "Float?": "number",
    "Boolean?": "boolean",
    "DateTime?": "string",
    "Json?": "Record<string, any>",
    "Decimal?": "number",
  };

  const models = {};
  const enums = {};

  // --- Parse Models ---
  let match;
  while ((match = modelRegex.exec(sanitizedSchema)) !== null) {
    const modelName = match[1];
    // Each field line, e.g.: "id Int @id @default(autoincrement())"
    const fields = match[2].trim().split("\n").map((line) => line.trim());

    const convertedFields = fields.map((fieldLine) => {
      // Split by whitespace to get the fieldName and the Prisma type
      // e.g. ["id", "Int", "@id", "@default(autoincrement())"]
      const [fieldName, prismaType] = fieldLine.split(/\s+/);

      // Check if the type is referencing another model
      const isRelation = /^[A-Z]/.test(prismaType) && !typeMap[prismaType];

      const jsType = isRelation
        ? `${prismaType}${prismaType.endsWith('?') ? ' | null' : ''}` // Reference the related model
        : typeMap[prismaType] || "any"; // Fallback to `any` if type not found

      return `${fieldName}: ${jsType}`;
    });

    models[modelName] = convertedFields;
  }

  // --- Parse Enums ---
  while ((match = enumRegex.exec(sanitizedSchema)) !== null) {
    const enumName = match[1];
    // Lines inside the enum block
    const enumValues = match[2].trim().split("\n").map((line) => line.trim());
    enums[enumName] = enumValues;
  }

  return { models, enums };
};

/**
 * Generate TypeScript interfaces for models
 * @param {Record<string, string[]>} models
 */
const generateTypeScriptInterfaces = (models) => {
  return Object.entries(models)
    .map(([modelName, fields]) => {
      return `export interface ${modelName} {
  ${fields.join("\n  ")}
}`;
    })
    .join("\n\n");
};

/**
 * Generate TypeScript enums
 * @param {Record<string, string[]>} enums
 */
const generateTypeScriptEnums = (enums) => {
  return Object.entries(enums)
    .map(([enumName, enumValues]) => {
      // Map each enum value to `VALUE = "VALUE"` form
      const enumMembers = enumValues
        .map((v) => `${v} = "${v}"`)
        .join(",\n  ");

      return `export enum ${enumName} {
  ${enumMembers}
}`;
    })
    .join("\n\n");
};

/**
 * Write the generated content to a file.
 * @param {string} filePath - Path to the output TypeScript file
 * @param {string} content - Content to write to the file
 */
const writeToFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Generated TypeScript definitions written to: ${filePath}`);
};

const schemaPath = "C:/Users/kozan/Desktop/321/backend/src/prisma/schema.prisma";
const outputPath = "C:/Users/kozan/Desktop/321/frontend/types.ts";

const { models, enums } = parsePrismaSchema(schemaPath);
const modelInterfaces = generateTypeScriptInterfaces(models);
const enumDefinitions = generateTypeScriptEnums(enums);

// Combine interfaces and enums into one file content
const fileContent = `${modelInterfaces}\n\n${enumDefinitions}`;

// Write the content to the output file
writeToFile(outputPath, fileContent);
