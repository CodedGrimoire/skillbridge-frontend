"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import SectionContainer from "../../components/ui/SectionContainer";
import LoadingCard from "../../components/LoadingCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function CareerPathPage() {
  const { loading: authLoading } = useRequireAuth();
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [graph, setGraph] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  const fetchGraph = async () => {
    if (!roleId) {
      setError("Choose a starting role.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.get(`/career/path/${roleId}`);
      setGraph(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load career path");
    } finally {
      setLoading(false);
    }
  };

  // Convert backend graph {nodes:[{role,matchedSkills,missingSkills}], edges:[{from,to}]} to reactflow format
  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };
    const rfNodes = graph.nodes.map((n: any, idx: number) => ({
      id: n.role,
      data: { label: n.role, matched: n.matchedSkills, missing: n.missingSkills },
      position: { x: 150 * idx, y: 80 * idx },
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
          <h1 className="text-3xl font-semibold">Career Path Graph</h1>
          <p className="text-slate-400">Visualize potential role progressions and what skills you need at each step.</p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <Card className="p-6 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Starting Role</label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
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
          <Button onClick={fetchGraph} disabled={loading}>
            {loading ? "Loading graph..." : "Load Path"}
          </Button>
        </Card>

        {loading && (
          <div className="py-4">
            <LoadingCard lines={2} />
          </div>
        )}

        {graph && !loading && (
          <Card className="p-4">
            <div className="h-[480px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={(_, node) => setSelected(node)}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </Card>
        )}

        {selected && (
          <Card className="p-5 space-y-2">
            <h2 className="text-xl font-semibold">{selected.data.label}</h2>
            <p className="text-sm text-slate-300">
              Matched: {selected.data.matched?.join(", ") || "None"}
            </p>
            <p className="text-sm text-slate-300">
              Missing: {selected.data.missing?.join(", ") || "None"}
            </p>
          </Card>
        )}
      </div>
    </SectionContainer>
  );
}
