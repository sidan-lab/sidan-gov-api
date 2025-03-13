import { Request, Response } from "express";
import {
  createOrUpdateProposal,
  getProposalByTxHashCertIndex,
} from "../../services/governance/proposal";

export const getProposalByTxHashCertIndexController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { txHash, certIndex } = req.params;

  try {
    const proposal = await getProposalByTxHashCertIndex(txHash, certIndex);
    res.json({
      message: "success",
      proposal,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createOrUpdateProposalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { txHash, certIndex } = req.params;

  const requestBody = req.body;

  try {
    const proposal = await createOrUpdateProposal(
      txHash,
      certIndex,
      requestBody
    );
    res.json({
      message: "success",
      proposal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
