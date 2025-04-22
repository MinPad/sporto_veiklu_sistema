import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import LoadingDialog from "../components/core/LoadingDialog";
import CoachForm from "../components/forms/CoachForm";

export default function CoachEdit() {
    const { coachId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [coachData, setCoachData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient.get(`/coaches/${coachId}`)
            .then(({ data }) => {
                setCoachData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading coach:", err);
                setError("Could not load coach.");
                setLoading(false);
            });
    }, [coachId]);

    const handleUpdate = async (payload) => {
        return axiosClient.put(`/coaches/${coachId}`, payload).then(() => {
            navigate("/coaches");
        });
    };

    return (
        <PageComponent title={coachData ? `Edit Coach: ${coachData.name} ${coachData.surname}` : "Loading Coach..."}>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <CoachForm onSubmit={handleUpdate} initialData={coachData} submitText="Update Coach" />
            )}
        </PageComponent>
    );
}