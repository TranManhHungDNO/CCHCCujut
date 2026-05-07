import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { FeedbackPage, FeedbackDetailPage, CreateFeedbackPage } from "./Feedback";
import { GuidelinesPage } from "./Guidelines";
import { HomePage } from "./Home";
import { InformationGuidePage } from "./InformationGuide";
import { CreateScheduleAppointmentPage } from "./CreateScheduleAppointment";
import { AppointmentScheduleResultPage } from "./AppointmentScheduleResult";
import { SearchPage } from "./Search";

// CHỈ IMPORT TỪ PROFILE (Vì đã gom hết vào đây rồi)
import { 
    ProfilePage,
    ProfileInfo, 
    MemberProfilePage, 
    GroupDetailPage, 
    GroupListPage 
} from "./Profile";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cns-list" element={<GroupListPage />} />
            <Route path="/cns-group" element={<GroupDetailPage />} />
            <Route path="/cns-profile" element={<MemberProfilePage />} />

            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/feedbacks" element={<FeedbackPage />} />
            <Route path="/feedbacks/:id" element={<FeedbackDetailPage />} />
            <Route path="/create-feedback" element={<CreateFeedbackPage />} />
            <Route path="/create-schedule-appointment" element={<CreateScheduleAppointmentPage />} />
            <Route path="/schedule-appointment-result" element={<AppointmentScheduleResultPage />} />
            <Route path="/information-guide" element={<InformationGuidePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cam" element={<ProfileInfo />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;