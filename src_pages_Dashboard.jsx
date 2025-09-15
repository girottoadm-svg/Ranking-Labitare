import React, { useState, useEffect } from "react";
import { Player } from "@/entities/Player";
import { Match } from "@/entities/Match";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, Users, Calendar, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import RecentMatches from "../components/dashboard/RecentMatches";
import TopPlayers from "../components/dashboard/TopPlayers";
import TodaySchedule from "../components/dashboard/TodaySchedule";

const Dashboard = () => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [playerData, matchData] = await Promise.all([
        Player.list('-points'),
        Match.list('-created_date')
      ]);
      setPlayers(playerData);
      setMatches(matchData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const todayMatches = matches.filter(match => {
    const today = new Date().toISOString().split('T')[0];
    return match.date === today;
  });

  const completedMatches = matches.filter(match => match.status === 'finalizada');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🎾 Ranking Labitare
            </h1>
            <p className="text-gray-600">Condomínio - Temporada 2025</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("Players")} className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Jogadores
              </Button>
            </Link>
            <Link to={createPageUrl("Matches")} className="flex-1 md:flex-none">
              <Button className="w-full tennis-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Partida
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Jogadores Ativos"
            value={players.length}
            icon={Users}
            color="blue"
            trend={`+${players.length} cadastrados`}
          />
          <StatsCard
            title="Partidas Hoje"
            value={todayMatches.length}
            icon={Calendar}
            color="green"
            trend={todayMatches.length > 0 ? "Quadras ocupadas" : "Sem jogos hoje"}
          />
          <StatsCard
            title="Partidas Realizadas"
            value={completedMatches.length}
            icon={Trophy}
            color="orange"
            trend={`${matches.length} no total`}
          />
          <StatsCard
            title="Líder Atual"
            value={players[0]?.name || "-"}
            icon={TrendingUp}
            color="purple"
            trend={players[0] ? `${players[0].points} pontos` : "Sem ranking"}
            isText={true}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentMatches 
              matches={matches.slice(0, 5)}
              isLoading={isLoading}
            />
            <TodaySchedule 
              matches={todayMatches}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <TopPlayers 
              players={players.slice(0, 5)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;