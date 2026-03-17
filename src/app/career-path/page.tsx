"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import api from "../../services/api";
import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LoadingCard from "../../components/LoadingCard";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../hooks/useAuth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CareerPathPage() {
  const { user } = useAuth();
  const { loading: authLoading } = useRequireAuth();

  const [roles, setRoles] = useState<any[]>([]);
  const [pathRoleId, setPathRoleId] = useState("");
  const [simRoleId, setSimRoleId] = useState("");
  const [graph, setGraph] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [pathLoading, setPathLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [newSkills, setNewSkills] = useState("");
  const [simResult, setSimResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  const fetchGraph = async () => {
    if (!pathRoleId) {
      setError("Choose a starting role.");
      return;
    }
    setError(null);
    setPathLoading(true);
    try {
      const res = await api.get(`/career/path/${pathRoleId}`);
      setGraph(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load career path");
    } finally {
      setPathLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!simRoleId || !newSkills.trim()) {
      setSimError("Select a role and add at least one skill.");
      return;
    }
    setSimError(null);
    setSimLoading(true);
    try {
      const skillsArray = newSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await api.post("/simulation/run", {
        userId: user?.id,
        roleId: simRoleId,
        newSkills: skillsArray,
      });
      setSimResult(res.data);
    } catch (err: any) {
      setSimError(err?.response?.data?.message || "Simulation failed");
    } finally {
      setSimLoading(false);
    }
  };

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };
    const rfNodes = graph.nodes.map((n: any, idx: number) => ({
      id: n.role,
      data: { label: n.role, matched: n.matchedSkills, missing: n.missingSkills },
      position: { x: 180 * idx, y: 80 * idx },
      style: { borderRadius: 12, padding: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" },
    }));
    const rfEdges = graph.edges.map((e: any, i: number) => ({
      id: `e-${i}`,
      source: e.from,
      target: e.to,
      animated: true,
      style: { stroke: "#38bdf8" },
    }));
    return { nodes: rfNodes, edges: rfEdges };
  }, [graph]);

  const barData = useMemo(() => {
    if (!simResult) return [];
    return [
      { name: "Current", value: simResult.currentMatch || 0 },
      { name: "Simulated", value: simResult.simulatedMatch || 0 },
    ];
  }, [simResult]);

  if (authLoading) {
    return (
      <SectionContainer>
        <div className="py-12">
          <LoadingCard lines={3} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="py-12 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Career Path & Simulator</h1>
          <p className="text-slate-400">
            Visualize role progressions and simulate how learning new skills boosts your match.
          </p>
        </div>

        {/* Career Path Graph */}
        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Starting Role</label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                value={pathRoleId}
                onChange={(e) => setPathRoleId(e.target.value)}
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={fetchGraph} disabled={pathLoading}>
            {pathLoading ? "Loading graph..." : "Load Path"}
          </Button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </Card>

        {pathLoading && (
          <div className="py-4">
            <LoadingCard lines={2} />
          </div>
        )}

        {graph && !pathLoading && (
          <Card className="p-4">
            <div className="h-[480px]">
              <ReactFlow nodes={nodes} edges={edges} onNodeClick={(_, node) => setSelectedNode(node)} fitView>
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </Card>
        )}

        {selectedNode && (
          <Card className="p-5 space-y-2">
            <h2 className="text-xl font-semibold">{selectedNode.data.label}</h2>
            <p className="text-sm text-slate-300">
              Matched: {selectedNode.data.matched?.join(", ") || "None"}
            </p>
            <p className="text-sm text-slate-300">
              Missing: {selectedNode.data.missing?.join(", ") || "None"}
            </p>
          </Card>
        )}

        {/* Simulator */}
        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-slate-300 mb-1">Target Role</label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                value={simRoleId}
                onChange={(e) => setSimRoleId(e.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">New Skills to Learn (comma separated)</label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                placeholder="Docker, PostgreSQL, AWS"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={runSimulation} disabled={simLoading}>
            {simLoading ? "Simulating..." : "Run Simulation"}
          </Button>
          {simError && <p className="text-red-400 text-sm">{simError}</p>}
        </Card>

        {simResult && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Match Improvement</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Details</h2>
              <p className="text-sm text-slate-300">
                Matched Skills: {simResult.matchedSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300">
                Missing Skills: {simResult.missingSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {simResult.aiExplanation || "No AI explanation available."}
              </p>
            </Card>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
