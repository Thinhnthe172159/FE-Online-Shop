import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBannerModal from "./ModalAdd";
import { fetch } from "../../../api/Fetch";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [open, setOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch.get("/banners");
      setBanners(response.data);
    } catch (error) {
      setError("Failed to load banners. Please try again.");
      console.error("Failed to fetch banners", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (formData) => {
    try {
      setLoading(true);
      await fetch.post("/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchBanners();
      setOpen(false);
    } catch (error) {
      setError("Failed to add banner. Please try again.");
      console.error("Lỗi khi thêm banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBanner = async (id, formData) => {
    try {
      setLoading(true);
      await fetch.put(`/banners/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchBanners();
      setOpen(false);
      setEditBanner(null);
    } catch (error) {
      setError("Failed to update banner. Please try again.");
      console.error("Error updating banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBanner) {
      try {
        setLoading(true);
        await fetch.delete(`/banners/${selectedBanner.id}`);
        await fetchBanners();
      } catch (error) {
        setError("Failed to delete banner. Please try again.");
        console.error("Failed to delete banner", error);
      } finally {
        setLoading(false);
      }
    }
    setOpenDialog(false);
    setSelectedBanner(null);
  };

  const handleEditClick = (banner) => {
    setEditBanner(banner);
    setOpen(true);
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Card>
        <CardHeader
          title="Banner Management"
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Banner
            </Button>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : Array.isArray(banners) && banners.length > 0 ? (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>{banner.id}</TableCell>
                      <TableCell>{banner.description}</TableCell>
                      <TableCell>
                        <img
                          src={banner.image}
                          alt={`Image of ${banner.description}`}
                          width={100}
                          height={50}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(banner)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(banner)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No banners available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this banner?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <AddBannerModal
        open={open}
        handleClose={() => {
          setOpen(false);
          setEditBanner(null);
        }}
        handleAddBanner={handleAddBanner}
        handleUpdateBanner={handleUpdateBanner}
        editBanner={editBanner}
      />
    </div>
  );
};

export default BannerManager;