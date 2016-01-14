// Data Structure
exports.Edge = require("./mda/Core/Edge.js");
exports.HalfEdge = require("./mda/Core/HalfEdge.js");
exports.Vertex = require("./mda/Core/Vertex.js");
exports.Face = require("./mda/Core/Face.js");
exports.Mesh = require("./mda/Core/Mesh.js");

// Checks
exports.Integrity = require("./mda/Integrity/Integrity.js");
exports.MeshIntegrity = require("./mda/Integrity/MeshIntegrity.js");
exports.FaceIntegrity = require("./mda/Integrity/FaceIntegrity.js");
exports.EdgeIntegrity = require("./mda/Integrity/EdgeIntegrity.js");
exports.HalfEdgeIntegrity = require("./mda/Integrity/HalfEdgeIntegrity.js");
exports.VertexIntegrity = require("./mda/Integrity/VertexIntegrity.js");

// Queries
exports.EdgeVertices = require("./mda/Queries/EdgeVertices.js");
exports.FaceHalfEdges = require("./mda/Queries/FaceHalfEdges.js");
exports.FaceVertices = require("./mda/Queries/FaceVertices.js");
exports.VertexFaces = require("./mda/Queries/VertexFaces.js");
exports.VertexHalfEdges = require("./mda/Queries/VertexHalfEdges.js");
exports.VertexNeighbors = require("./mda/Queries/VertexNeighbors.js");

// Operators
exports.InsertVertexOperator = require("./mda/Operators/InsertVertex.js");
exports.InsertEdgeOperator = require("./mda/Operators/InsertEdge.js");
exports.DeleteEdgeOperator = require("./mda/Operators/DeleteEdge.js");

exports.LoopOperator = require("./mda/Operators/Loop.js");
exports.CatmullClarkOperator = require("./mda/Operators/CatmullClark.js");
exports.QuadSubdivideOperator = require("./mda/Operators/QuadSubdivide.js");
exports.TriangulateOperator = require("./mda/Operators/Triangulate.js");
