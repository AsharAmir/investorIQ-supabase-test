import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Building2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import PropertyCard from "../components/PropertyCard";
import AddPropertyModal from "../components/AddPropertyModal";
import DealAnalyzer from "../components/DealAnalyzer";
import AskAIModal from "../components/AskAIModal";
import RequestAdvisorModal from "../components/RequestAdvisorModal";
import { supabase } from "../lib/supabase";
import type { Property, AdvisorRequest } from "../types";
import toast from "react-hot-toast";

export default function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [advisorRequests, setAdvisorRequests] = useState<AdvisorRequest[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Fetch properties for the logged-in user
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
        return;
      }

      setProperties(data || []);
    };

    // Fetch advisor requests for the logged-in user
    const fetchAdvisorRequests = async () => {
      const { data, error } = await supabase
        .from("advisor_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching advisor requests:", error);
        toast.error("Failed to load advisor requests");
        return;
      }

      setAdvisorRequests(data || []);
    };

    fetchProperties();
    fetchAdvisorRequests();
  }, [user]);

  const handleAddProperty = async (data: any) => {
    if (!user) return;

    try {
      const propertyData = {
        ...data,
        user_id: user.id,
        iq_score: Math.floor(Math.random() * 5) + 5, // Random IQ score
      };

      const { error } = await supabase
        .from("properties")
        .insert([propertyData]);

      if (error) {
        console.error("Error adding property:", error);
        toast.error("Failed to add property");
        return;
      }

      setIsAddModalOpen(false);
      toast.success("Property added successfully!");
      // Refetch properties
      const { data: updatedProperties } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setProperties(updatedProperties || []);
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.deal_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdvisorRequest = (propertyId: string) => {
    return advisorRequests.find(
      (request) => request.property_id === propertyId
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-10 w-10 text-indigo-600 mr-3" />
              My Properties
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage and analyze your real estate investments
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Building2 className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-xl text-gray-600">
                No properties found. Add your first property to get started!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  advisorRequest={getAdvisorRequest(property.id)}
                  onAnalyze={() => {
                    setSelectedProperty(property);
                    setIsAnalyzerOpen(true);
                  }}
                  onAskAI={() => {
                    setSelectedProperty(property);
                    setIsAIModalOpen(true);
                  }}
                  onRequestAdvisor={() => {
                    setSelectedProperty(property);
                    setIsAdvisorModalOpen(true);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedProperty && (
          <>
            <DealAnalyzer
              property={selectedProperty}
              isOpen={isAnalyzerOpen}
              onClose={() => setIsAnalyzerOpen(false)}
            />
            <AskAIModal
              property={selectedProperty}
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
            />
            <RequestAdvisorModal
              property={selectedProperty}
              isOpen={isAdvisorModalOpen}
              onClose={() => setIsAdvisorModalOpen(false)}
            />
          </>
        )}

        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProperty}
        />
      </div>
    </div>
  );
}
