import { ArrowBackIos, Create, Delete } from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonBase,
    FormControlLabel,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteArticleAPI } from "../service/api";
import styled from "styled-components";

// Styled Components
const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: "relative",
    height: 200,
    [theme.breakpoints.down("sm")]: {
        width: "100% !important",
        height: 100,
    },
    "&:hover, &.Mui-focusVisible": {
        zIndex: 1,
        "& .MuiImageBackdrop-root": {
            opacity: 0.15,
        },
        "& .MuiImageMarked-root": {
            opacity: 0,
        },
        "& .MuiTypography-root": {
            border: "4px solid currentColor",
        },
    },
}));

const ImageSrc = styled("span")({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
}));

// Profile Component
const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const { articles } = useSelector((state) => state.articles);
    const navigate = useNavigate();
    const [article, setArticle] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        gender: "female",
        email: "",
        name: "",
        age: "",
        image: null,
    });
    const [id, setId] = useState(null);

    // Handlers
    const handleEdit = () => setEdit(true);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        try {
            const response = await fetch(
                "https://mustafocoder.pythonanywhere.com/auth/update-profile/",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: data,
                }
            );

            if (response.ok) {
                alert("Profile updated successfully");
                setEdit(false);
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || "Failed to update profile"}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const deleteHandler = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await deleteArticleAPI(id, token);
                navigate("/");
            } catch (error) {
                alert("Error deleting article");
            }
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (articles && user) {
            const ar = articles.filter((a) => a.author === user.username);
            setArticle(ar);
        }
    }, [articles, user]);

    return (
        <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-6">
                <div className="flex flex-col items-center">
                    <img
                        className="w-[320px] h-[320px] object-cover rounded-full mb-4"
                        src={
                            user?.image
                                ? `https://mustafocoder.pythonanywhere.com/api${user.image}`
                                : "https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg"
                        }
                        alt="Profile"
                    />
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                </div>
                <ul className="my-6 space-y-2 text-gray-700">
                    <li>
                        <span className="font-semibold">Name:</span>{" "}
                        {user?.name}
                    </li>
                    <li>
                        <span className="font-semibold">Gender:</span>{" "}
                        {user?.gender}
                    </li>
                    <li>
                        <span className="font-semibold">Email:</span>{" "}
                        {user?.email}
                    </li>
                    <li>
                        <span className="font-semibold">Age:</span> {user?.age}
                    </li>
                </ul>
                <Button
                    onClick={handleEdit}
                    variant="contained"
                    endIcon={<Create />}
                >
                    Update
                </Button>
            </div>

            <div className="max-w-2xl w-full bg-white shadow-md rounded-lg mt-6 p-6">
                <h2 className="text-xl font-bold mb-4">Your Articles</h2>
                {article.length > 0 ? (
                    article.map((a, index) => (
                        <ul key={index}>
                            <li>
                                <img
                                    className="rounded-2xl my-5"
                                    src={`https://mustafocoder.pythonanywhere.com/api${a.image}`}
                                    alt=""
                                />
                            </li>
                            <li className="font-bold text-center">{a.title}</li>
                            <li className="font-normal w-[620px] break-words line-clamp-3">
                                {a.content}
                            </li>
                            <li className="flex justify-end mt-4 gap-3">
                                <button
                                    onClick={() =>
                                        navigate(`/update-article/${a.id}`)
                                    }
                                    className="px-3 py-1.5 rounded hover:bg-blue-700 bg-blue-600 text-white"
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                                <button
                                    onClick={() => {
                                        setId(a.id);
                                        setOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded hover:bg-red-700 bg-red-500 text-white"
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </li>
                        </ul>
                    ))
                ) : (
                    <p className="text-gray-500">
                       Artikel qoshib korsanggiz shu profilni egasi qoshgan habarlar chiqadi hozir bosh
                    </p>
                )}
            </div>

            {open && (
                <div className="fixed w-full top-0 start-0 h-full bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="p-5 bg-white dark:bg-black rounded">
                        <h3>Are you sure you want to delete this article?</h3>
                        <div className="flex mt-5 gap-2">
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(false)}
                                color="primary"
                                startIcon={<ArrowBackIos />}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={deleteHandler}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {edit && (
                <Modal
                    open={edit}
                    onClose={() => setEdit(false)}
                    aria-labelledby="edit-modal-title"
                    aria-describedby="edit-modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <Typography id="edit-modal-title" variant="h6">
                            Update Profile
                        </Typography>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                        <RadioGroup
                            value={formData.gender}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    gender: e.target.value,
                                }))
                            }
                        >
                            <FormControlLabel
                                value="male"
                                control={<Radio />}
                                label="Male"
                            />
                            <FormControlLabel
                                value="female"
                                control={<Radio />}
                                label="Female"
                            />
                        </RadioGroup>
                        <TextField
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    age: e.target.value,
                                }))
                            }
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<i className="fa fa-upload"></i>}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default Profile;
