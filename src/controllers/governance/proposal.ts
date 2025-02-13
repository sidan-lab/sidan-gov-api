import { Request, Response } from "express";
import {
  createOrUpdateProposal,
  getProposalByTxHashCertIndex,
} from "../../services/governance/proposal";

export const getProposalByTxHashCertIndexController = async (
  req: Request,
  res: Response
) => {
  const { txHash, certIndex } = req.params;

  try {
    const proposal = await getProposalByTxHashCertIndex(txHash, certIndex);
    return res.json({
      message: "success",
      proposal,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const createOrUpdateProposalController = async (
  req: Request,
  res: Response
) => {
  const { txHash, certIndex } = req.params;

  const requestBody = req.body;

  try {
    const proposal = await createOrUpdateProposal(
      txHash,
      certIndex,
      requestBody
    );
    return res.json({
      message: "success",
      proposal,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
