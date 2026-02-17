
import Layout from "@/components/layout/Layout";
import RoommateSearchGrid from "@/components/roommates/RoommateSearchGrid";
import { useNavigate } from "react-router-dom";

const SearchGridPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <RoommateSearchGrid onBack={() => navigate('/roommates')} />
        </Layout>
    );
};

export default SearchGridPage;
