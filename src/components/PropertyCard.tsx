import { motion } from "framer-motion";
import {
  Building2,
  Star,
  Brain,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Trash2,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Property, AdvisorRequest } from "../types";

interface PropertyCardProps {
  property: Property;
  onAnalyze: (id: string) => void;
  onAskAI: (id: string) => void;
  onRequestAdvisor: (id: string) => void;
  onEdit: (property: Property) => void;
  advisorRequest?: AdvisorRequest;
}

export default function PropertyCard({
  property,
  onAnalyze,
  onAskAI,
  onRequestAdvisor,
  onEdit,
  advisorRequest,
}: PropertyCardProps) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDoc(doc(db, "properties", property.id));
        toast.success("Property deleted successfully");
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error("Failed to delete property");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
    >
      <div className="relative h-64">
        <div className="absolute inset-0">
          <img
            src={property.images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
          >
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">
                {property.iqScore}/10
              </span>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-4 left-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => onEdit(property)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleDelete}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {property.title}
          </h3>
          <p className="text-gray-600">{property.address}</p>
          <div className="mt-2 flex items-center">
            <Building2 className="h-4 w-4 text-indigo-600 mr-2" />
            <span className="text-sm text-gray-600">{property.dealType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${property.price.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </div>

        {advisorRequest && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            {getStatusBadge(advisorRequest.status)}
            {advisorRequest.response && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Advisor Response:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {advisorRequest.response}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnalyze(property.id)}
            className="col-span-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Analyze Deal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAskAI(property.id)}
            className="flex items-center justify-center p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            title="Ask AI"
          >
            <Brain className="h-5 w-5 text-indigo-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRequestAdvisor(property.id)}
            className="col-span-3 flex items-center justify-center p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-colors"
          >
            <UserCog className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-600">
              Request Advisor
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
